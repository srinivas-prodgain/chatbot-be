import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';

type TPopulatedAuthor = {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    profile_image: string;
    bio: string;
    role: string;
}

type TArticleWithAuthors = {
    _id: Schema.Types.ObjectId;
    title: string;
    author: TPopulatedAuthor;
    co_authors: TPopulatedAuthor[];
}

type TCollectionResponse = {
    _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    icon: string;
    total_articles: number;
    is_published: boolean;
    level: number;
    parent_collection: Schema.Types.ObjectId;
}

type TFormattedAuthor = {
    id: Schema.Types.ObjectId;
    name: string;
    email: string;
    profile_image: string;
    bio: string;
    role: string;
}

type TFormattedArticle = {
    id: Schema.Types.ObjectId;
    title: string;
}

type TFormattedChildCollection = {
    id: Schema.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    icon: string;
    article_count: number;
}

type TFormattedCollection = {
    id: Schema.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    icon: string;
    level: number;
    parent_collection: Schema.Types.ObjectId;
    total_articles: number;
}

type TResponseData = {
    collection: TFormattedCollection;
    authors: TFormattedAuthor[];
    articles: TFormattedArticle[];
    child_collections: TFormattedChildCollection[];
}

export const get_collection_by_id = async (req: Request, res: Response) => {

    const { _id } = get_collection_by_id_params_schema.parse(req.params);

    const collection = await mg.Collection.findById<TCollectionResponse>(_id)

    if (!collection) {
        throw_error('Collection not found', 404);
    }

    if (!collection!.is_published) {
        throw_error('Collection not available', 404);
    }

    const articles_with_authors = mg.Article.find<TArticleWithAuthors>({
        collection_id: collection!._id,
        is_published: true
    })
        .select('title _id author co_authors')
        .populate('author', 'name email profile_image bio role')
        .populate('co_authors', 'name email profile_image bio role')
        .sort({ title: 1 });

    if (!articles_with_authors) {
        throw_error('Articles not found', 404);
    }

    const child_collections = mg.Collection.find<TCollectionResponse>({
        parent_collection: collection!._id,
        is_published: true
    })
        .select('title description slug icon total_articles _id')
        .sort({ title: 1 });

    const [articles_with_authors_data, child_collections_data] = await Promise.all([
        articles_with_authors,
        child_collections
    ]);

    const authors_set = new Set<Schema.Types.ObjectId>();
    const authors_list: TFormattedAuthor[] = [];

    const addAuthorToList = (author: TPopulatedAuthor): void => {
        const authorId = author._id;
        if (!authors_set.has(authorId)) {
            authors_set.add(authorId);
            authors_list.push({
                id: author._id,
                name: author.name,
                email: author.email,
                profile_image: author.profile_image,
                bio: author.bio,
                role: author.role
            });
        }
    };

    articles_with_authors_data.forEach(article => {
        addAuthorToList(article.author);

        if (article.co_authors && article.co_authors.length > 0) {
            article.co_authors.forEach(coAuthor => {
                addAuthorToList(coAuthor);
            });
        }
    });

    const formatted_articles: TFormattedArticle[] = articles_with_authors_data.map(article => ({
        id: article._id,
        title: article.title
    }));

    const formatted_child_collections: TFormattedChildCollection[] = child_collections_data.map(child => ({
        id: child._id,
        title: child.title,
        description: child.description,
        slug: child.slug,
        icon: child.icon,
        article_count: child.total_articles
    }));

    const formatted_collection: TFormattedCollection = {
        id: collection!._id,
        title: collection!.title,
        description: collection!.description,
        slug: collection!.slug,
        icon: collection!.icon,
        level: collection!.level,
        parent_collection: collection!.parent_collection,
        total_articles: collection!.total_articles
    };

    const response_data: TResponseData = {
        collection: formatted_collection,
        authors: authors_list,
        articles: formatted_articles,
        child_collections: formatted_child_collections
    };

    res.status(200).json({
        message: "Collection retrieved successfully",
        data: response_data
    });

}

const get_collection_by_id_params_schema = z.strictObject({
    _id: z.string().min(1, "Collection ID is required")
});
