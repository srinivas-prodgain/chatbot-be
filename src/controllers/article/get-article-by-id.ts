import { z } from 'zod';
import { mg } from '../../config/mg';
import { throw_error } from '../../utils/throw-error';
import { Schema } from 'mongoose';
import { ArticleReactionItem } from '../../models/article';
import { Request, Response } from 'express';

type TPopulatedAuthor = {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    profile_image: string;
    bio: string;
    role: string;
    social_links: {
        linkedin: string;
        twitter: string;
    };
}

type TArticleWithPopulatedAuthors = {
    _id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    author: TPopulatedAuthor;
    co_authors: TPopulatedAuthor[];
    related_articles: TArticleWithPopulatedAuthors[];
    tags: string[];
    read_time: number;
    is_published: boolean;
    reactions?: ArticleReactionItem[];
    createdAt: Date;
    updatedAt: Date;
}

type TFormattedAuthor = {
    id: Schema.Types.ObjectId;
    name: string;
    email: string;
    profile_image: string;
    bio: string;
    role: string;
    social_links: {
        linkedin: string;
        twitter: string;
    };
}

type TFormattedRelatedArticle = {
    id: Schema.Types.ObjectId;
    title: string;
}

type TFormattedArticle = {
    id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    tags: string[];
    read_time: number;
    related_articles: TFormattedRelatedArticle[];
    reaction?: ArticleReactionItem;
    created_at: Date;
    updated_at: Date;
}

type TResponseData = {
    article: TFormattedArticle;
    author: TFormattedAuthor;
    co_authors: TFormattedAuthor[];
}

export const get_article_by_id = async (req: Request, res: Response) => {
    const { _id } = get_article_by_id_params_schema.parse(req.params);
    const { user_id } = get_article_by_id_query_schema.parse(req.query);

    const article = await mg.Article.findById<TArticleWithPopulatedAuthors>(_id)
        .populate('author', 'name email profile_image bio role social_links')
        .populate('co_authors', 'name email profile_image bio role social_links')
        .populate('related_articles', 'title _id');

    if (!article) {
        throw_error('Article not found', 404);
    }

    if (!article!.is_published) {
        throw_error('Article not available', 404);
    }

    const formatAuthor = (author: TPopulatedAuthor): TFormattedAuthor => ({
        id: author._id,
        name: author.name,
        email: author.email,
        profile_image: author.profile_image,
        bio: author.bio,
        role: author.role,
        social_links: {
            linkedin: author.social_links?.linkedin || '',
            twitter: author.social_links?.twitter || ''
        }
    });

    const formatted_author = formatAuthor(article!.author);

    const formatted_co_authors: TFormattedAuthor[] = [];
    if (article!.co_authors && article!.co_authors.length > 0) {
        article!.co_authors.forEach(coAuthor => {
            if (coAuthor) {
                formatted_co_authors.push(formatAuthor(coAuthor));
            }
        });
    }

    const user_reaction = article!.reactions?.filter((reaction) => reaction.user_id.toString() === user_id);

    const formatted_related_articles: TFormattedRelatedArticle[] = article!.related_articles.map(relatedArticle => ({
        id: relatedArticle._id,
        title: relatedArticle.title,
    }));

    const formatted_article: TFormattedArticle = {
        id: article!._id,
        title: article!.title,
        slug: article!.slug,
        content: article!.content,
        excerpt: article!.excerpt,
        collection_id: article!.collection_id,
        tags: article!.tags,
        read_time: article!.read_time,
        related_articles: formatted_related_articles,
        reaction: user_reaction?.[0],
        created_at: article!.createdAt,
        updated_at: article!.updatedAt
    };

    const response_data: TResponseData = {
        article: formatted_article,
        author: formatted_author,
        co_authors: formatted_co_authors
    };

    res.status(200).json({
        message: "Article retrieved successfully",
        data: response_data
    });
}

const get_article_by_id_params_schema = z.strictObject({
    _id: z.string().min(1, "Article ID is required")
});

const get_article_by_id_query_schema = z.strictObject({
    user_id: z.string().min(1, "User ID is required")
});