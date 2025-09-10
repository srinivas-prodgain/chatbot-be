import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';
import { Schema } from 'mongoose';

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

export const get_top_articles = async ({ req, res }: TrequestResponse) => {
    // Get the 4 newest published articles - only ID and title
    const articles = await mg.Article.find<TArticle>({
        isPublished: true
    })
        .select('_id title')
        .sort({ createdAt: -1 })
        .limit(4);

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
