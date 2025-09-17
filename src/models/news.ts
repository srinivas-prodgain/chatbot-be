import { Document, model, Schema } from "mongoose";

export const NEWS_REACTIONS = ['sleeping', 'heart', 'thumbsdown', 'tada'] as const;
export type NewsReaction = typeof NEWS_REACTIONS[number];

export type NewsReactionItem = {
    reaction: NewsReaction;
    user_id: Schema.Types.ObjectId;
};

export const categories = ['ai-news', 'company-news', 'product-update', 'industry', 'technology', 'announcement'] as const;
type TCategory = (typeof categories)[number];


type TNews = Document & {
    title: string;
    slug: string;
    content: string;
    image_url: string;
    thumbnail_url: string;
    author: Schema.Types.ObjectId;
    category: TCategory;
    tags: string[];
    published_at: Date;
    is_published: boolean;
    is_featured: boolean;
    read_time: number;
    reactions: NewsReactionItem[];
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
        enum: categories,
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

export const News = model('News', newsSchema);