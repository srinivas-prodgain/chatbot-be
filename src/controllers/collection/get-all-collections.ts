import { Request, Response } from 'express';

import { mg } from '@/config/mg';
import { throw_error } from '@/utils/throw-error';
import { TCollection } from '@/models/collection';
import { z_pagination } from '@/utils/schema';

export const get_all_collections = async (req: Request, res: Response) => {

    const { page, limit } = z_pagination().parse(req.query);

    const collections = mg.Collection.find<TCollection>({
        level: 0,
        is_published: true
    })
        .select('title description slug icon total_articles')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ title: 1 });

    const get_total_collections = mg.Collection.countDocuments({
        level: 0,
        is_published: true
    });

    const [collections_data, total_collections] = await Promise.all([collections, get_total_collections]);

    if (!collections_data) {
        throw_error('Collections not found', 404);
    }

    const formatted_collections = collections_data.map(collection => ({
        id: collection._id,
        title: collection.title,
        description: collection.description,
        slug: collection.slug,
        icon: collection.icon,
        article_count: collection.total_articles
    }));

    const total_pages = Math.ceil(total_collections / limit);

    res.status(200).json({
        message: "Root collections retrieved successfully",
        data: formatted_collections,
        pagination: {
            page,
            limit,
            total_pages,
            total_collections
        }
    });

}