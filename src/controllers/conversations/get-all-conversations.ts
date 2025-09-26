import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TConversation } from '@/models/conversation';
import { z_pagination, z_object_id } from '@/utils/schema';

export const get_all_conversations = async (req: Request, res: Response) => {

    const { page, limit, user_id } = z_get_all_conversations_query_schema.parse(req.query);

    const conversations = mg.Conversation.find<TConversation>({
        user_id: user_id,
        status: 'active'
    })
        .select('title user_id status updatedAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 }).lean();

    const get_total_conversations = mg.Conversation.countDocuments({
        user_id: user_id,
        status: 'active'
    });

    const [conversations_data, total_conversations] = await Promise.all([conversations, get_total_conversations]);

    if (conversations_data.length === 0) {
        throw_error('Conversations not found', 404);
    }

    const total_pages = Math.ceil(total_conversations / limit);

    res.status(200).json({
        message: "Active conversations retrieved successfully",
        data: conversations_data,
        pagination: {
            page,
            limit,
            total_pages,
            total_conversations
        }
    });

}

const z_get_all_conversations_query_schema = z.object({
    user_id: z_object_id
}).merge(z_pagination());