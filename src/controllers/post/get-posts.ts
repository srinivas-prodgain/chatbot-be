import { z } from 'zod';
import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';

export const get_posts = async ({ req, res }: TrequestResponse) => {

    const { page, limit } = get_posts_schema.parse(req.query);

    const posts = mg.Post.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const get_total_posts = mg.Post.countDocuments();

    const [posts_data, total_posts] = await Promise.all([posts, get_total_posts]);

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

const get_posts_schema = z.strictObject({
    page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().default('10').transform(Number).pipe(z.number().min(1).max(100))
});
