import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/config/mg';
import { NEWS_REACTIONS } from '@/models/news';
import { throw_error } from '@/utils/throw-error';


export const submit_news_reaction = async (req: Request, res: Response) => {
    const { _id } = z_submit_news_reaction_params.parse(req.params);
    const { reaction } = z_submit_news_reaction_body.parse(req.body);
    const { user_id } = z_submit_news_reaction_req_query.parse(req.query);

    // First, try to find if this user already has a reaction on this news
    const news = await mg.News.findById(_id);

    if (!news) {
        throw_error('News not found', 404);
    }

    // Check if user already has a reaction
    const existing_reaction_index = news.reactions.findIndex(
        r => r.user_id.toString() === user_id
    );

    let updatedNews;

    if (existing_reaction_index !== -1) {
        // Update existing reaction
        updatedNews = await mg.News.findByIdAndUpdate(
            _id,
            { $set: { [`reactions.${existing_reaction_index}.reaction`]: reaction } },
            { new: true, runValidators: true }
        );
    } else {
        // Add new reaction
        updatedNews = await mg.News.findByIdAndUpdate(
            _id,
            { $push: { reactions: { reaction, user_id } } },
            { new: true, runValidators: true }
        );
    }

    if (!updatedNews) {
        throw_error('Failed to update news reaction', 500);
    }

    res.status(200).json({
        message: 'Reaction submitted successfully'
    });
};

const z_submit_news_reaction_params = z.object({
    _id: z.string().min(1, 'News ID is required')
});

const z_submit_news_reaction_req_query = z.object({
    user_id: z.string().min(1, 'User ID is required')
});

const z_submit_news_reaction_body = z.object({
    reaction: z.enum(NEWS_REACTIONS),
});
