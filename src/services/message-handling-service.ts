import { Types } from 'mongoose';

import { mg } from '@/config/mg';
import { TConversation } from '@/models/conversation';
import { TMessageSender } from '@/types/message';

import { generate_conversation_title } from './conversation-title-service';

export type TMessageHandlingParams = {
    conversation_id: string;
    message: string;
    user_id: string;
};

const DEFAULT_CONVERSATION_TITLE = 'New Chat';

type ConversationIdentifier = Types.ObjectId | string;
type ConversationHistoryMessage = {
    message: string;
    sender: TMessageSender;
    createdAt: Date;
};

export const message_handling_service = {
    async get_or_create_conversation({ conversation_id, message, user_id }: TMessageHandlingParams): Promise<TConversation> {
        let conversation = await mg.Conversation.findById<TConversation>(conversation_id);

        if (!conversation) {
            conversation = new mg.Conversation({
                _id: conversation_id,
                title: DEFAULT_CONVERSATION_TITLE,
                user_id: user_id
            });
            await conversation.save();
        }

        return conversation;
    },

    async save_user_message({ message, conversation_id, user_id }: { message: string, conversation_id: ConversationIdentifier, user_id: string }) {
        const user_message = new mg.Message({
            message,
            sender: 'user',
            conversation_id,
            user_id: user_id
        });
        await user_message.save();
    },

    async save_ai_message({ ai_response, conversation_id, user_id }: { ai_response: string, conversation_id: ConversationIdentifier, user_id: string }) {
        if (!ai_response.trim()) {
            return;
        }

        const ai_message = new mg.Message({
            message: ai_response,
            sender: 'assistant',
            conversation_id,
            user_id: user_id
        });

        const save_message_promise = ai_message.save();
        const update_conversation_promise = (async () => {
            const update: Record<string, unknown> = { updatedAt: new Date() };

            try {
                const conversation = await mg.Conversation.findById(conversation_id).select('title').lean();

                if (conversation?.title === DEFAULT_CONVERSATION_TITLE) {
                    const first_user_message = await mg.Message.findOne({ conversation_id, sender: 'user' })
                        .sort({ createdAt: 1 })
                        .select('message')
                        .lean();

                    if (first_user_message?.message) {
                        const generated_title = await generate_conversation_title({
                            user_message: first_user_message.message,
                            ai_message: ai_response
                        });

                        if (generated_title) {
                            update.title = generated_title;
                        }
                    }
                }
            } catch (error) {
                console.error('Unable to update conversation title', error);
            }

            return mg.Conversation.findByIdAndUpdate(conversation_id, update);
        })();

        await Promise.all([save_message_promise, update_conversation_promise]);
    },

    async get_conversation_history({ conversation_id }: { conversation_id: ConversationIdentifier }): Promise<ConversationHistoryMessage[]> {
        const messages: ConversationHistoryMessage[] = await mg.Message.find({ conversation_id })
            .sort({ createdAt: 1 }) // Sort by creation time (oldest first)
            .select({ message: 1, sender: 1, createdAt: 1, _id: 0 })
            .lean()
            .exec();

        return messages;
    }


}; 
