import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TNews } from '@/models/news';
import { z_infinite_scroll } from '@/utils/schema';

type TQuery = {
    is_published: boolean;
    _id?: { $lt: Types.ObjectId };
};

export const get_all_news = async (req: Request, res: Response) => {

    const { limit, cursor } = z_infinite_scroll().parse(req.query);

    // Build query with cursor-based pagination
    const query: TQuery = { is_published: true };

    // Add cursor condition for pagination
    if (cursor) {
        query._id = { $lt: cursor }; // Using $lt for descending order (published_at: -1)
    }

    const news = await mg.News.find<TNews>(query)
        .select('title slug content image_url tags _id')
        .limit(limit + 1) // Get one extra to check if there are more
        .sort({ published_at: -1, _id: -1 });

    if (!news) {
        throw_error('News not found', 404);
    }

    // Check if there are more results
    const has_more = news.length > limit;
    const news_to_return = has_more ? news.slice(0, -1) : news;
    const next_cursor = has_more && news_to_return.length > 0 ?
        news_to_return[news_to_return.length - 1]?._id?.toString() || null : null;

    // Truncate content to 3 lines (approximately 150 characters)
    const formatted_news = news_to_return.map(item => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        image: item.image_url,
        tags: item.tags,
        description: item.content.length
    }));

    res.status(200).json({
        message: "News retrieved successfully",
        data: formatted_news,
        infinite_scroll: {
            has_more,
            next_cursor,
            limit
        }
    });

}