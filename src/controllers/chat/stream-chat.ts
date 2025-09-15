import { z } from 'zod';
import { ModelMessage, streamText } from 'ai';
import { model } from '../../services/ai';
import { message_handling_service } from '../../services/message-handling-service';
import { Types } from 'mongoose';
import { search_user_documents } from '../../tools/search-user-documents';
import { getSystemPrompt } from '../../lib/system-prompt';
import { throw_error } from '../../utils/throw-error';
import { Request, Response } from 'express';


export const stream_chat = async (req: Request, res: Response) => {

    const { _id } = z_stream_chat_messages_req_params.parse(req.params);
    const { user_id } = z_stream_chat_messages_req_query.parse(req.query);
    const { message } = z_stream_chat_messages_req_body.parse(req.body);

    const conversation = await message_handling_service.get_or_create_conversation({ conversation_id: _id, message, user_id: req.body.user_id });
    await message_handling_service.save_user_message({ message, conversation_id: conversation._id as Types.ObjectId, user_id: req.body.user_id });

    if (!conversation) {
        throw_error('Conversation not found', 404);
    }

    const system_message: ModelMessage = {
        role: 'system',
        content: getSystemPrompt(user_id)
    };

    const conversation_history = (await message_handling_service.get_conversation_history({ conversation_id: conversation._id as Types.ObjectId })).map((message) => ({ role: message.sender as 'user' | 'assistant', content: message.message }));

    const result = streamText({
        model,
        messages: [system_message, ...conversation_history],
        maxOutputTokens: 1000,
        // tools: {
        //     search_user_documents,
        // },
        onFinish: async (event) => {
            await message_handling_service.save_ai_message({
                ai_response: event.text,
                conversation_id: conversation._id as Types.ObjectId,
                user_id: user_id
            });
        }
    });

    result.pipeUIMessageStreamToResponse(res);

};

const z_stream_chat_messages_req_params = z.object({
    _id: z.string().min(1, 'id is required'),
});

const z_stream_chat_messages_req_query = z.object({
    user_id: z.string().min(1, 'user_id is required')
});

const z_stream_chat_messages_req_body = z.object({
    message: z.string().min(1, 'message is required'),
});
