import { Document, model, Schema } from "mongoose";
import { update_collection_article_count } from "../utils/update-collection-article-count";

export const ARTICLE_REACTIONS = ['sad', 'middle', 'happy'] as const;
export type ArticleReaction = typeof ARTICLE_REACTIONS[number];

export type ArticleReactionItem = {
    reaction: ArticleReaction;
    user_id: Schema.Types.ObjectId;
};

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
    reactions: ArticleReactionItem[];
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

// Middleware to update collection article count after article operations
ArticleSchema.post('save', async function (doc) {
    try {
        await update_collection_article_count(doc.collection_id);
    } catch (error) {
        console.error('Error updating collection count after article save:', error);
    }
});

ArticleSchema.pre('deleteOne', async function () {
    try {
        if (this.getQuery && this.getQuery()._id) {
            const doc = await this.model.findById(this.getQuery()._id);
            if (doc) {
                this.set('_originalCollectionId', doc.collection_id);
            }
        }
    } catch (error) {
        console.error('Error preparing for article delete:', error);
    }
});

ArticleSchema.post('deleteOne', async function () {
    try {
        const originalCollectionId = this.get('_originalCollectionId');
        if (originalCollectionId) {
            await update_collection_article_count(originalCollectionId);
        }
    } catch (error) {
        console.error('Error updating collection count after article delete:', error);
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

export const Article = model('Article', ArticleSchema);