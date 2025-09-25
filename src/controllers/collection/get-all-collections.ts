import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TCollection } from '@/models/collection';
import { z_infinite_scroll } from '@/utils/schema';

type TQuery = {
    level: number;
    is_published: boolean;
    _id?: { $gt: Types.ObjectId };
}

export const get_all_collections = async (req: Request, res: Response) => {

    const { limit, cursor } = z_infinite_scroll().parse(req.query);

    // Build query with cursor-based pagination
    const query: TQuery = {
        level: 0,
        is_published: true
    };

    // Add cursor condition for pagination
    if (cursor) {
        query._id = { $gt: cursor }; // Using $gt for ascending order (title: 1)
    }

    const collections = await mg.Collection.find<TCollection>(query)
        .select('title description slug icon total_articles')
        .limit(limit + 1) // Get one extra to check if there are more
        .sort({ title: 1, _id: 1 });

    if (!collections) {
        throw_error('Collections not found', 404);
    }

    // Check if there are more results
    const has_more = collections.length > limit;
    const collections_to_return = has_more ? collections.slice(0, -1) : collections;
    const next_cursor = has_more && collections_to_return.length > 0 ?
        collections_to_return[collections_to_return.length - 1]?._id?.toString() || null : null;

    const formatted_collections = collections_to_return.map(collection => ({
        id: collection._id,
        title: collection.title,
        description: collection.description,
        slug: collection.slug,
        icon: collection.icon,
        article_count: collection.total_articles
    }));

    res.status(200).json({
        message: "Root collections retrieved successfully",
        data: formatted_collections,
        infinite_scroll: {
            has_more,
            next_cursor,
            limit
        }
    });

}