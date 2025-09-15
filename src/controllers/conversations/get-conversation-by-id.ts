import { z } from 'zod';

import { mg } from '../../config/mg';
import { throw_error } from '../../utils/throw-error';


import { Request, Response } from 'express';

export const get_conversation_by_id = async (req: Request, res: Response) => {
    const { _id } = z_get_conversation_by_id_req_params.parse(req.params);

    const conversation = await mg.Conversation.findOne({ _id }).lean();

    if (!conversation) {
        throw_error('Conversation not found', 404);
    }

    const messages = await mg.Message.find({ conversation_id: conversation._id })
        .sort({ createdAt: 1 })
        .select('message sender createdAt updatedAt').lean();

    if (!messages) {
        throw_error('Messages not found', 404);
    }

    const conversation_with_messages = {
        ...conversation,
        messages
    };

    res.status(200).json({
        data: conversation_with_messages,
        message: "Conversation fetched successfully"
    });
};

const z_get_conversation_by_id_req_params = z.object({
    _id: z.string().min(1, 'id is required')
});
