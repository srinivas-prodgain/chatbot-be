import { mg } from '../../config/mg';
import { Schema } from 'mongoose';
import { throw_error } from '../../utils/throw-error';
import { Request, Response } from 'express';

type TArticle = {
    _id: Schema.Types.ObjectId;
    title: string;
};

type TFormattedArticle = {
    id: Schema.Types.ObjectId;
    title: string;
};

type TResponseData = {
    articles: TFormattedArticle[];
    total_count: number;
};

export const get_top_articles = async (req: Request, res: Response) => {

    const articles = await mg.Article.find<TArticle>({
        is_published: true
    })
        .select('_id title')
        .sort({ createdAt: -1 })
        .limit(4);

    if (!articles) {
        throw_error('Articles not found', 404);
    }

    const formatted_articles: TFormattedArticle[] = articles.map(article => ({
        id: article._id,
        title: article.title
    }));

    const response_data: TResponseData = {
        articles: formatted_articles,
        total_count: formatted_articles.length
    };

    res.status(200).json({
        message: "Top articles retrieved successfully",
        data: response_data
    });
};
