import { z } from 'zod';
import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';

export const get_all_conversations = async ({ req, res }: TrequestResponse) => {

    const { user_id } = get_all_conversations_schema.parse(req.body);
    const { page, limit } = get_all_conversations_query_schema.parse(req.query);
    console.log(user_id, page, limit);

    const conversations = mg.Conversation.find({
        userId: user_id,
        status: 'active'
    })
        .select('title userId status')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 }).lean();

    const get_total_conversations = mg.Conversation.countDocuments({
        userId: user_id,
        status: 'active'
    });

    const [conversations_data, total_conversations] = await Promise.all([conversations, get_total_conversations]);

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

const get_all_conversations_query_schema = z.strictObject({
    page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().default('10').transform(Number).pipe(z.number().min(1).max(100))
});

const get_all_conversations_schema = z.strictObject({
    user_id: z.string().min(1, 'user_id is required')
});
