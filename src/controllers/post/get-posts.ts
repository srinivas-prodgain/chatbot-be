import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TPost } from '@/models/post';

export const get_posts = async (req: Request, res: Response) => {

    const { page, limit } = z_get_posts_req_query.parse(req.query);

    const posts = mg.Post.find<TPost>()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const get_total_posts = mg.Post.countDocuments();

    const [posts_data, total_posts] = await Promise.all([posts, get_total_posts]);

    if (!posts_data) {
        throw_error('Posts not found', 404);
    }

    const total_pages = Math.ceil(total_posts / limit);

    res.status(200).json({
        message: "Posts retrieved successfully",
        data: posts_data,
        pagination: {
            page,
            limit,
            total_pages,
            total_posts
        }
    });

}

const z_get_posts_req_query = z.strictObject({
    page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().default('10').transform(Number).pipe(z.number().min(1).max(100))
});
