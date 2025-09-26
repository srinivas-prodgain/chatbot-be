import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TPost } from '@/models/post';
import { z_infinite_scroll } from '@/utils/schema';

type TQuery = {
    _id?: { $lt: Types.ObjectId };
    is_active: boolean;
};

export const get_posts = async (req: Request, res: Response) => {

    const { limit, cursor } = z_infinite_scroll().parse(req.query);

    // Build query with cursor-based pagination
    const query: TQuery = { is_active: true };

    // Add cursor condition for pagination
    if (cursor) {
        query._id = { $lt: cursor }; // Using $lt for descending order to get older posts
    }

    const posts = await mg.Post.find<TPost>(query)
        .limit(limit + 1) // Get one extra to check if there are more
        .sort({ createdAt: -1, _id: -1 });

    if (!posts) {
        throw_error('Posts not found', 404);
    }

    // Check if there are more results
    const has_more = posts.length > limit;
    const posts_to_return = has_more ? posts.slice(0, -1) : posts;
    const next_cursor = has_more && posts_to_return.length > 0 ?
        posts_to_return[posts_to_return.length - 1]?._id?.toString() || null : null;

    res.status(200).json({
        message: "Posts retrieved successfully",
        data: posts_to_return,
        infinite_scroll: {
            has_more,
            next_cursor,
            limit
        }
    });

}
