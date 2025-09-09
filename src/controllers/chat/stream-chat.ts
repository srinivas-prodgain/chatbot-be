import { z } from 'zod';
import { TrequestResponse } from '../../types/shared';
import { streamText } from 'ai';
import { model } from '../../services/ai';
import { message_handling_service } from '../../services/message-handling-service';
import { Types } from 'mongoose';


export const stream_chat = async ({ req, res }: TrequestResponse) => {

    const { id } = z_stream_chat_messages_req_params.parse(req.params);
    const { message, user_id } = z_stream_chat_messages_req_body.parse(req.body);

    const conversation = await message_handling_service.get_or_create_conversation({ conversation_id: id, message, user_id: req.body.user_id });
    await message_handling_service.save_user_message({ message, conversation_id: conversation._id as Types.ObjectId, user_id: req.body.user_id });

    const result = streamText({
        model,
        messages: [{ role: 'user', content: message }],
        maxOutputTokens: 1000,
        onFinish: async (event) => {
            await message_handling_service.save_ai_message({
                ai_response: event.text,
                conversation_id: conversation._id as Types.ObjectId,
                user_id: user_id
            });
        }
    });

    result.pipeTextStreamToResponse(res);

};

const z_stream_chat_messages_req_params = z.object({
    id: z.string().min(1, 'id is required'),
});

const z_stream_chat_messages_req_body = z.object({
    message: z.string().min(1, 'message is required'),
    user_id: z.string().min(1, 'user_id is required')
});
