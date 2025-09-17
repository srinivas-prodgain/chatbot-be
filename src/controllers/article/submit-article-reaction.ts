import { Article } from '../../models/article';
import { ARTICLE_REACTIONS } from '../../models/article';
import { throw_error } from '../../utils/throw-error';
import { Request, Response } from 'express';
import { z } from 'zod';


export const submit_article_reaction = async (req: Request, res: Response) => {
    const { _id } = z_submit_article_reaction_params.parse(req.params);
    const { user_id } = z_submit_article_reaction_query.parse(req.query);
    const { reaction } = z_submit_article_reaction_body.parse(req.body);

    // First, try to find if this user already has a reaction on this article
    const article = await Article.findById(_id);

    if (!article) {
        throw_error('Article not found', 404);
    }

    // Check if user already has a reaction
    const existing_reaction_index = article.reactions.findIndex(
        r => r.user_id.toString() === user_id
    );

    let updatedArticle;

    if (existing_reaction_index !== -1) {
        // Update existing reaction
        updatedArticle = await Article.findByIdAndUpdate(
            _id,
            { $set: { [`reactions.${existing_reaction_index}.reaction`]: reaction } },
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
        throw_error('Failed to update article reaction', 500);
    }

    res.status(200).json({
        message: 'Reaction submitted successfully'
    });
};

const z_submit_article_reaction_params = z.object({
    _id: z.string().min(1, 'Article ID is required')
});

const z_submit_article_reaction_query = z.object({
    user_id: z.string().min(1, 'User ID is required')
});

const z_submit_article_reaction_body = z.object({
    reaction: z.enum(ARTICLE_REACTIONS),
});