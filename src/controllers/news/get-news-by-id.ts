import { z } from 'zod';
import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';
import { throw_error } from '../../utils/throw-error';

export const get_news_by_id = async ({ req, res }: TrequestResponse) => {

    const { id } = get_news_by_id_schema.parse(req.params);

    const news = await mg.News.findById(id)
        .populate('author', 'name profileImage')
        .exec();

    if (!news) {
        throw_error({ message: "News not found", status_code: 404 });
        return; // This line will never be reached, but helps TypeScript
    }

    if (!news.isPublished) {
        throw_error({ message: "News is not published", status_code: 403 });
        return; // This line will never be reached, but helps TypeScript
    }

    res.status(200).json({
        message: "News retrieved successfully",
        data: {
            id: news._id,
            title: news.title,
            slug: news.slug,
            content: news.content,
            imageUrl: news.imageUrl,
            thumbnailUrl: news.thumbnailUrl,
            author: news.author,
            category: news.category,
            tags: news.tags,
            publishedAt: news.publishedAt,
            isPublished: news.isPublished,
            isFeatured: news.isFeatured,
            readTime: news.readTime
        }
    });

}

const get_news_by_id_schema = z.strictObject({
    id: z.string().min(1, "News ID is required")
});
