import { Document, model, Schema } from "mongoose";

import { update_collection_article_count } from "@/utils/update-collection-article-count";
import { ARTICLE_REACTIONS } from "@/constants/reactions";
import { TArticleReactionItem } from "@/types/reactions";

type TArticle = Document & {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    co_authors: Schema.Types.ObjectId[];
    related_articles: Schema.Types.ObjectId[];
    tags: string[];
    read_time: number;
    is_published: boolean;
    reactions: TArticleReactionItem[];
}


const ArticleSchema = new Schema<TArticle>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxLength: 300
    },
    collection_id: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true,
        index: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    co_authors: [{
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }],
    related_articles: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    tags: [String],
    read_time: {
        type: Number,  // in minutes
        default: 5
    },
    is_published: {
        type: Boolean,
        default: true
    },
    reactions: [{
        reaction: {
            type: String,
            enum: ARTICLE_REACTIONS,
            required: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
}, {
    timestamps: true
});

// Create indexes for optimized queries
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ co_authors: 1 });
ArticleSchema.index({ is_published: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ related_articles: 1 });
ArticleSchema.index({ collection_id: 1, is_published: 1 }); // Compound index for published articles in collections
ArticleSchema.index({ author: 1, is_published: 1 }); // Compound index for published articles by author
ArticleSchema.index({ createdAt: -1 }); // For sorting by creation date
ArticleSchema.index({ updatedAt: -1 }); // For sorting by update date

// Middleware to update collection article count after article operations
ArticleSchema.post('save', async function (doc) {
    try {
        await update_collection_article_count(doc.collection_id);
    } catch (error) {
        console.error('Error updating collection count after article save:', error);
    }
});

ArticleSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (doc) {
            await update_collection_article_count(doc.collection_id);
        }
    } catch (error) {
        console.error('Error updating collection count after article delete:', error);
    }
});

// Handle updates to isPublished or collection_id changes
ArticleSchema.post('findOneAndUpdate', async function (doc) {
    try {
        if (doc) {
            await update_collection_article_count(doc.collection_id);

            // If the original document had a different collection_id, update that one too
            const original = this.getOptions().original;
            if (original && original.collection_id && original.collection_id !== doc.collection_id) {
                await update_collection_article_count(original.collection_id);
            }
        }
    } catch (error) {
        console.error('Error updating collection count after article update:', error);
    }
});

export const Article = model<TArticle>('Article', ArticleSchema);