import { z } from 'zod';

import { mg } from '../../config/mg';

import { TrequestResponse } from '../../types/shared';

export const create_conversation = async ({ req, res }: TrequestResponse) => {
    const { title } = z_create_conversation_req_body.parse(req.body);

    const user_id = req.body.user_id;

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
});