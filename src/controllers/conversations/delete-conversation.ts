import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';

export const delete_conversation = async (req: Request, res: Response) => {
    const { _id } = z_delete_conversation_req_params.parse(req.params);

    const conversation = await mg.Conversation.findByIdAndDelete(_id);

    if (!conversation) {
        throw_error('Conversation not found', 404);
    }

    await mg.Message.deleteMany({ conversation_id: conversation._id });

    res.status(200).json({
        message: 'Conversation deleted successfully'
    });
};

const z_delete_conversation_req_params = z.object({
    _id: z.string().min(1, 'id is required')
});
