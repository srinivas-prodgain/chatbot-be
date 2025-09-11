import { mg } from '../../config/mg';
import { NEWS_REACTIONS } from '../../models/news';
import { throw_error } from '../../utils/throw-error';
import { TrequestResponse } from '../../types/shared';
import { z } from 'zod';


export const submit_news_reaction = async ({ req, res }: TrequestResponse) => {
    const { _id } = z_submit_news_reaction_params.parse(req.params);
    const { reaction, user_id } = z_submit_news_reaction_body.parse(req.body);

    // First, try to find if this user already has a reaction on this news
    const news = await mg.News.findById(_id);

    if (!news) {
        throw_error({ message: 'News not found', status_code: 404 });
        return; // This will never be reached due to throw_error, but helps TypeScript
    }

    // Check if user already has a reaction
    const existingReactionIndex = news.reactions.findIndex(
        r => r.user_id.toString() === user_id
    );

    let updatedNews;

    if (existingReactionIndex !== -1) {
        // Update existing reaction
        updatedNews = await mg.News.findByIdAndUpdate(
            _id,
            { $set: { [`reactions.${existingReactionIndex}.reaction`]: reaction } },
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
        throw_error({ message: 'Failed to update news reaction', status_code: 500 });
    }

    res.status(200).json({
        message: 'Reaction submitted successfully'
    });
};

const z_submit_news_reaction_params = z.object({
    _id: z.string().min(1, 'News ID is required')
});

const z_submit_news_reaction_body = z.object({
    reaction: z.enum(NEWS_REACTIONS),
    user_id: z.string().min(1, 'User ID is required')
});
