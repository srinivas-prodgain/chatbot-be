import { Document, model, Schema } from "mongoose";


export const categories = ['ai-news', 'company-news', 'product-update', 'industry', 'technology', 'announcement'] as const;
type TCategory = (typeof categories)[number];


type TNews = Document & {
    title: string;
    slug: string;
    headline: string;
    content: string;
    imageUrl: string;
    thumbnailUrl: string;
    author: Schema.Types.ObjectId;
    category: TCategory;
    tags: string[];
    publishedAt: Date;
    isPublished: boolean;
    isFeatured: boolean;
    readTime: number;
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
    headline: {
        type: String,
        required: true,
        maxLength: 200
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
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
    publishedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    readTime: {
        type: Number,  // in minutes
        default: 5
    }
}, {
    timestamps: true
});

export const News = model('News', newsSchema);