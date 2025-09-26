import { Document, model, Schema } from "mongoose";

import { NEWS_REACTIONS } from "@/constants/reactions";
import { NEWS_CATEGORIES } from "@/constants/categories";
import { TNewsReactionItem } from "@/types/reactions";
import { TNewsCategory } from "@/types/categories";


export type TNews = Document & {
    title: string;
    slug: string;
    content: string;
    image_url: string;
    thumbnail_url: string;
    author: Schema.Types.ObjectId;
    category: TNewsCategory;
    tags: string[];
    published_at: Date;
    is_published: boolean;
    is_featured: boolean;
    read_time: number;
    reactions: TNewsReactionItem[];
}

const newsSchema = new Schema<TNews>({
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
    image_url: {
        type: String,
        required: true
    },
    thumbnail_url: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    category: {
        type: String,
        enum: NEWS_CATEGORIES,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    published_at: {
        type: Date,
        default: Date.now,
        index: true
    },
    is_published: {
        type: Boolean,
        default: true
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    read_time: {
        type: Number,  // in minutes
        default: 5
    },
    reactions: [{
        reaction: {
            type: String,
            enum: NEWS_REACTIONS,
            required: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
}, {
    timestamps: true
});

// Create indexes for optimized queries
newsSchema.index({ author: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ is_published: 1 });
newsSchema.index({ is_featured: 1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ published_at: -1 }); // Descending for latest first
newsSchema.index({ is_published: 1, published_at: -1 }); // Compound index for published articles sorted by date
newsSchema.index({ is_featured: 1, is_published: 1 }); // Compound index for featured published articles
newsSchema.index({ category: 1, is_published: 1 }); // Compound index for category filtering
newsSchema.index({ is_published: 1, published_at: -1, _id: -1 }); // Compound index for cursor-based pagination

export const News = model<TNews>('News', newsSchema);