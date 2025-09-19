import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';

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
    const { search } = z_articles_by_search_query_schema.parse(req.query);

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
            matched_snippet = create_snippet(article.content, search);
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

const z_articles_by_search_query_schema = z.object({
    search: z.string().min(1, "Search query is required")
});



const create_snippet = (text: string, search_term: string): string => {
    const search_regex_global = new RegExp(search_term, 'gi');

    // Find the first match
    const match = text.match(search_regex_global);
    if (!match) return text.substring(0, 50) + '...';

    const match_index = text.search(search_regex_global);
    const before_text = text.substring(0, match_index);
    const before_words = before_text.split(/\s+/).filter(word => word.length > 0);
    const after_text = text.substring(match_index + match[0].length);
    const after_words = after_text.split(/\s+/).filter(word => word.length > 0);

    // Get 5 words before and after
    const context_before = before_words.slice(-5).join(' ');
    const context_after = after_words.slice(0, 5).join(' ');

    // Construct the snippet
    const snippet = [
        context_before,
        match[0],
        context_after
    ].filter(part => part.length > 0).join(' ');

    return snippet.trim();
};