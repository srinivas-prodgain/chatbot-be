import { z } from 'zod';

import { mg } from '../../config/mg';

import { TrequestResponse } from '../../types/shared';

export const create_conversation = async ({ req, res }: TrequestResponse) => {
    const { title, user_id } = z_create_conversation_req_body.parse(req.body);

    const conversation = await mg.Conversation.create({
        title: title || 'New Chat',
        userId: user_id
    });

    res.status(201).json({
        message: "Conversation created successfully",
        data: {
            _id: conversation._id
        }
    });
};

const z_create_conversation_req_body = z.object({
    title: z.string().max(100).optional(),
    user_id: z.string().min(1, 'user_id is required')
});