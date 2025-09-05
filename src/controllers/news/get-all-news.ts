import { z } from 'zod';
import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';

export const get_all_news = async ({ req, res }: TrequestResponse) => {

    const { page, limit } = get_all_news_query_schema.parse(req.query);

    const news = mg.News.find({ isPublished: true })
        .select('title slug content imageUrl tags _id')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ publishedAt: -1 });

    const get_total_news = mg.News.countDocuments({ isPublished: true });

    const [news_data, total_news] = await Promise.all([news, get_total_news]);

    // Truncate content to 3 lines (approximately 150 characters)
    const formatted_news = news_data.map(item => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        image: item.imageUrl,
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

const get_all_news_query_schema = z.strictObject({
    page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
    limit: z.string().default('10').transform(Number).pipe(z.number().min(1).max(100))
});
