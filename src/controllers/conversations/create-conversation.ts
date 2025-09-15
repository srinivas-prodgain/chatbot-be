import { z } from 'zod';

import { mg } from '../../config/mg';

import { Request, Response } from 'express';
import { throw_error } from '../../utils/throw-error';

export const create_conversation = async (req: Request, res: Response) => {
    const { user_id } = z_create_conversation_req_query.parse(req.query);
    const { title } = z_create_conversation_req_body.parse(req.body);

    const conversation = await mg.Conversation.create({
        title: title || 'New Chat',
        userId: user_id
    });

    if (!conversation) {
        throw_error('Conversation not created', 500);
    }

    res.status(201).json({
        message: "Conversation created successfully",
        data: {
            _id: conversation._id
        }
    });
};

const z_create_conversation_req_query = z.object({
    user_id: z.string().min(1, 'user_id is required')
});

const z_create_conversation_req_body = z.object({
    title: z.string().max(100).optional(),
});