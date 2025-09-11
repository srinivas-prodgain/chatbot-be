import { Article } from '../../models/article';
import { ARTICLE_REACTIONS } from '../../models/article';
import { throw_error } from '../../utils/throw-error';
import { TrequestResponse } from '../../types/shared';
import { z } from 'zod';


export const submit_article_reaction = async ({ req, res }: TrequestResponse) => {
    const { _id } = z_submit_article_reaction_params.parse(req.params);
    const { reaction, user_id } = z_submit_article_reaction_body.parse(req.body);

    // First, try to find if this user already has a reaction on this article
    const article = await Article.findById(_id);

    if (!article) {
        throw_error({ message: 'Article not found', status_code: 404 });
        return; // This will never be reached due to throw_error, but helps TypeScript
    }

    // Check if user already has a reaction
    const existingReactionIndex = article.reactions.findIndex(
        r => r.user_id.toString() === user_id
    );

    let updatedArticle;

    if (existingReactionIndex !== -1) {
        // Update existing reaction
        updatedArticle = await Article.findByIdAndUpdate(
            _id,
            { $set: { [`reactions.${existingReactionIndex}.reaction`]: reaction } },
            { new: true, runValidators: true }
        );
    } else {
        // Add new reaction
        updatedArticle = await Article.findByIdAndUpdate(
            _id,
            { $push: { reactions: { reaction, user_id } } },
            { new: true, runValidators: true }
        );
    }

    if (!updatedArticle) {
        throw_error({ message: 'Failed to update article reaction', status_code: 500 });
    }

    res.status(200).json({
        message: 'Reaction submitted successfully'
    });
};

const z_submit_article_reaction_params = z.object({
    _id: z.string().min(1, 'Article ID is required')
});

const z_submit_article_reaction_body = z.object({
    reaction: z.enum(ARTICLE_REACTIONS),
    user_id: z.string().min(1, 'User ID is required')
});