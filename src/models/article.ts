import { Document, model, Schema } from "mongoose";
import { updateCollectionArticleCount } from "../utils/update-collection-article-count";


type TArticle = Document & {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    collection_id: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    coAuthors: Schema.Types.ObjectId[];
    relatedArticles: Schema.Types.ObjectId[];
    tags: string[];
    readTime: number;
    isPublished: boolean;
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
    coAuthors: [{
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }],
    relatedArticles: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    tags: [String],
    readTime: {
        type: Number,  // in minutes
        default: 5
    },
    isPublished: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

// Middleware to update collection article count after article operations
ArticleSchema.post('save', async function (doc) {
    try {
        await updateCollectionArticleCount(doc.collection_id);
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
            await updateCollectionArticleCount(originalCollectionId);
        }
    } catch (error) {
        console.error('Error updating collection count after article delete:', error);
    }
});

ArticleSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (doc) {
            await updateCollectionArticleCount(doc.collection_id);
        }
    } catch (error) {
        console.error('Error updating collection count after article delete:', error);
    }
});

// Handle updates to isPublished or collection_id changes
ArticleSchema.post('findOneAndUpdate', async function (doc) {
    try {
        if (doc) {
            await updateCollectionArticleCount(doc.collection_id);

            // If the original document had a different collection_id, update that one too
            const original = this.getOptions().original;
            if (original && original.collection_id && original.collection_id !== doc.collection_id) {
                await updateCollectionArticleCount(original.collection_id);
            }
        }
    } catch (error) {
        console.error('Error updating collection count after article update:', error);
    }
});

export const Article = model('Article', ArticleSchema);