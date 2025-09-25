import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TConversation } from '@/models/conversation';
import { z_infinite_scroll, z_object_id } from '@/utils/schema';
import { TConversationStatus } from '@/types/conversation';

type TQuery = {
    user_id: Types.ObjectId;
    status: TConversationStatus;
    _id?: { $lt: Types.ObjectId };
}

export const get_all_conversations = async (req: Request, res: Response) => {

    const { limit, cursor, user_id } = z_get_all_conversations_query_schema.parse(req.query);

    // Build query with cursor-based pagination
    const query: TQuery = {
        user_id: user_id,
        status: 'active'
    };

    // Add cursor condition for pagination
    if (cursor) {
        query._id = { $lt: cursor }; // Using $lt for descending order (updatedAt: -1)
    }

    const conversations = await mg.Conversation.find<TConversation>(query)
        .select('title user_id status updatedAt')
        .limit(limit + 1) // Get one extra to check if there are more
        .sort({ updatedAt: -1, _id: -1 }).lean();

    if (conversations.length === 0) {
        throw_error('Conversations not found', 404);
    }

    // Check if there are more results
    const has_more = conversations.length > limit;
    const conversations_to_return = has_more ? conversations.slice(0, -1) : conversations;
    const next_cursor = has_more && conversations_to_return.length > 0 ?
        conversations_to_return[conversations_to_return.length - 1]?._id?.toString() || null : null;

    res.status(200).json({
        message: "Active conversations retrieved successfully",
        data: conversations_to_return,
        infinite_scroll: {
            has_more,
            next_cursor,
            limit
        }
    });

}

const z_get_all_conversations_query_schema = z.object({
    user_id: z_object_id
}).merge(z_infinite_scroll());