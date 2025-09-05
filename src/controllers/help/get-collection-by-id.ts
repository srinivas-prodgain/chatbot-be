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
}

type TArticleWithAuthors = {
    _id: Schema.Types.ObjectId;
    title: string;
    author: TPopulatedAuthor;
    coAuthors: TPopulatedAuthor[];
}

type TCollectionResponse = {
    _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    slug: string;
    icon: string;
    total_articles: number;
    isPublished: boolean;
    level: number;
    parentCollection: Schema.Types.ObjectId;
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

export const get_collection_by_id = async ({ req, res }: TrequestResponse) => {

    const { collection_id } = get_collection_by_id_params_schema.parse(req.params);

    const collection = await mg.Collection.findById<TCollectionResponse>(collection_id)

    if (!collection) {
        throw_error({ message: 'Collection not found', status_code: 404 });
    }

    if (!collection!.isPublished) {
        throw_error({ message: 'Collection not available', status_code: 404 });
    }

    const articles_with_authors = mg.Article.find<TArticleWithAuthors>({
        collection_id: collection!._id,
        isPublished: true
    })
        .select('title _id author coAuthors')
        .populate('author', 'name email profileImage bio role')
        .populate('coAuthors', 'name email profileImage bio role')
        .sort({ title: 1 });

    const child_collections = mg.Collection.find<TCollectionResponse>({
        parentCollection: collection!._id,
        isPublished: true
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
                profile_image: author.profileImage,
                bio: author.bio,
                role: author.role
            });
        }
    };

    articles_with_authors_data.forEach(article => {
        addAuthorToList(article.author);

        if (article.coAuthors && article.coAuthors.length > 0) {
            article.coAuthors.forEach(coAuthor => {
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
        parent_collection: collection!.parentCollection,
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
    collection_id: z.string().min(1, "Collection ID is required")
});
