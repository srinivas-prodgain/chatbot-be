import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';

export const get_all_news = async (req: Request, res: Response) => {

    const { page, limit } = z_get_all_news_req_query.parse(req.query);

    const news = mg.News.find({ is_published: true })
        .select('title slug content image_url tags _id')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ published_at: -1 });

    const get_total_news = mg.News.countDocuments({ is_published: true });

    const [news_data, total_news] = await Promise.all([news, get_total_news]);

    if (!news_data) {
        throw_error('News not found', 404);
    }

    // Truncate content to 3 lines (approximately 150 characters)
    const formatted_news = news_data.map(item => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        image: item.image_url,
        tags: item.tags,
        description: item.content.length > 150
            ? item.content.substring(0, 150) + '...'
            : item.content
    }));

    const total_pages = Math.ceil(total_news / limit);

    res.status(200).json({
        message: "News retrieved successfully",
        data: formatted_news,
        pagination: {
            page,
            limit,
            total_pages,
            total_news
        }
    });

}

const z_get_all_news_req_query = z.strictObject({
    page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().default('10').transform(Number).pipe(z.number().min(1).max(100))
});
