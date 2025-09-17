import { z } from 'zod';
import { mg } from '../../config/mg';
import { Schema } from 'mongoose';
import { createSnippet } from '../../utils/create-snippet';
import { throw_error } from '../../utils/throw-error';
import { Request, Response } from 'express';

type TArticleSearchResult = {
    _id: Schema.Types.ObjectId;
    title: string;
    content: string;
    is_published: boolean;
}

type TFormattedSearchArticle = {
    id: Schema.Types.ObjectId;
    title: string;
    matched_snippet: string;
}

type TResponseData = {
    articles: TFormattedSearchArticle[];
    total_count: number;
    search_query: string;
}

export const get_articles_by_search = async (req: Request, res: Response) => {
    const { search } = get_articles_by_search_query_schema.parse(req.query);

    // Create a case-insensitive regex pattern for searching
    const search_regex = new RegExp(search, 'i');

    // Search for articles where the search term appears in title or content
    const articles = await mg.Article.find<TArticleSearchResult>({
        is_published: true,
        $or: [
            { title: { $regex: search_regex } },
            { content: { $regex: search_regex } }
        ]
    })
        .select('_id title content')
        .limit(10)
        .sort({ createdAt: -1 });

    if (!articles) {
        throw_error('Articles not found', 404);
    }

    const formatted_articles: TFormattedSearchArticle[] = articles.map(article => {
        // Check if the search term is in the title
        const title_match = article.title.match(new RegExp(search, 'i'));
        let matched_snippet = '';

        if (title_match) {
            // If found in title, use the title as snippet
            matched_snippet = article.title;
        } else {
            // If found in content, create snippet from content
            matched_snippet = createSnippet(article.content, search);
        }

        return {
            id: article._id,
            title: article.title,
            matched_snippet
        };
    });

    const response_data: TResponseData = {
        articles: formatted_articles,
        total_count: formatted_articles.length,
        search_query: search
    };

    res.status(200).json({
        message: "Articles retrieved successfully",
        data: response_data
    });
}

const get_articles_by_search_query_schema = z.strictObject({
    search: z.string().min(1, "Search query is required")
});
