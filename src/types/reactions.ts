import { Schema } from "mongoose";
import { ARTICLE_REACTIONS, NEWS_REACTIONS } from "@/constants/reactions";

// Article reaction types
export type TArticleReaction = typeof ARTICLE_REACTIONS[number];

export type TArticleReactionItem = {
    reaction: TArticleReaction;
    user_id: Schema.Types.ObjectId;
};

// News reaction types
export type TNewsReaction = typeof NEWS_REACTIONS[number];

export type TNewsReactionItem = {
    reaction: TNewsReaction;
    user_id: Schema.Types.ObjectId;
};
