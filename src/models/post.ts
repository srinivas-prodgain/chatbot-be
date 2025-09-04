import { Document, model, Schema } from "mongoose";


export const categories = ['product', 'announcement', 'event', 'update', 'feature'] as const;
type TCategory = (typeof categories)[number];

type TPost = Document & {
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    linkText: string;
    category: TCategory;
    isActive: boolean;
    tags: string[];
}

const postSchema = new Schema<TPost>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    linkUrl: {
        type: String,
        required: true
    },
    linkText: {
        type: String,
        default: 'Learn More'
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String]
}, {
    timestamps: true
});

export const Post = model('Post', postSchema);