import { z } from 'zod';
import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';
import { throw_error } from '../../utils/throw-error';
import { Schema } from 'mongoose';

type TPopulatedAuthor = {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    profileImage: string;
    bio: string;
    role: string;
    socialLinks: {
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
    coAuthors: TPopulatedAuthor[];
    relatedArticles: TArticleWithPopulatedAuthors[];
    tags: string[];
    readTime: number;
    isPublished: boolean;
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

type TFormattedArticle = {
    id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    tags: string[];
    read_time: number;
    created_at: Date;
    updated_at: Date;
}

type TResponseData = {
    article: TFormattedArticle;
    author: TFormattedAuthor;
    co_authors: TFormattedAuthor[];
}

export const get_article_by_id = async ({ req, res }: TrequestResponse) => {
    const { article_id } = get_article_by_id_params_schema.parse(req.params);

    const article = await mg.Article.findById<TArticleWithPopulatedAuthors>(article_id)
        .populate('author', 'name email profileImage bio role socialLinks')
        .populate('coAuthors', 'name email profileImage bio role socialLinks');

    if (!article) {
        throw_error({ message: 'Article not found', status_code: 404 });
    }

    if (!article!.isPublished) {
        throw_error({ message: 'Article not available', status_code: 404 });
    }

    const formatAuthor = (author: TPopulatedAuthor): TFormattedAuthor => ({
        id: author._id,
        name: author.name,
        email: author.email,
        profile_image: author.profileImage,
        bio: author.bio,
        role: author.role,
        social_links: {
            linkedin: author.socialLinks?.linkedin || '',
            twitter: author.socialLinks?.twitter || ''
        }
    });

    const formatted_author = formatAuthor(article!.author);

    const formatted_co_authors: TFormattedAuthor[] = [];
    if (article!.coAuthors && article!.coAuthors.length > 0) {
        article!.coAuthors.forEach(coAuthor => {
            if (coAuthor) {
                formatted_co_authors.push(formatAuthor(coAuthor));
            }
        });
    }

    const formatted_article: TFormattedArticle = {
        id: article!._id,
        title: article!.title,
        slug: article!.slug,
        content: article!.content,
        excerpt: article!.excerpt,
        collection_id: article!.collection_id,
        tags: article!.tags,
        read_time: article!.readTime,
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
    article_id: z.string().min(1, "Article ID is required")
});
