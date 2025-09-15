import { z } from 'zod';
import { mg } from '../../config/mg';
import { Request, Response } from 'express';
import { throw_error } from '../../utils/throw-error';
import { NewsReactionItem } from '../../models/news';
import { Schema } from 'mongoose';

type TPopulatedAuthor = {
    _id: Schema.Types.ObjectId;
    name: string;
    profileImage: string;
    bio: string;
    role: string;
}


type TFormattedNews = {
    id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    author: TPopulatedAuthor;
    category: string;
    tags: string[];
    publishedAt: Date;
    isPublished: boolean;
    isFeatured: boolean;
    readTime: number;
    reaction?: NewsReactionItem;
}

type TNewsWithPopulatedAuthors = {
    _id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    author: TPopulatedAuthor;
    category: string;
    tags: string[];
    publishedAt: Date;
    isPublished: boolean;
    isFeatured: boolean;
    readTime: number;
    reactions: NewsReactionItem[];
}





export const get_news_by_id = async (req: Request, res: Response) => {

    const { _id } = z_get_news_by_id_req_params.parse(req.params);
    const { user_id } = z_get_news_by_id_req_query.parse(req.query);
    const news = await mg.News.findById<TNewsWithPopulatedAuthors>(_id)
        .populate('author')
        .exec();

    if (!news) {
        throw_error("News not found", 404);
    }

    if (!news.isPublished) {
        throw_error("News is not published", 403);
    }

    const user_reaction = news!.reactions?.filter((newsReaction) => newsReaction.user_id.toString() === user_id);

    const formatted_news: TFormattedNews = {
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
        readTime: news.readTime,
        reaction: user_reaction?.[0],
    }


    res.status(200).json({
        message: "News retrieved successfully",
        data: formatted_news
    });

}

const z_get_news_by_id_req_params = z.strictObject({
    _id: z.string().min(1, "News ID is required")
});

const z_get_news_by_id_req_query = z.strictObject({
    user_id: z.string().min(1, "User ID is required")
});