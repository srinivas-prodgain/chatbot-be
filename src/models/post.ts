import { Document, model, Schema } from "mongoose";


export const categories = ['product', 'announcement', 'event', 'update', 'feature', 'service'] as const;
type TCategory = (typeof categories)[number];

export type TPost = Document & {
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    link_text: string;
    category: TCategory;
    is_active: boolean;
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
    image_url: {
        type: String,
        required: true
    },
    link_url: {
        type: String,
        required: true
    },
    link_text: {
        type: String,
        default: 'Learn More'
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    tags: [String]
}, {
    timestamps: true
});

// Create indexes for optimized queries
postSchema.index({ category: 1 });
postSchema.index({ is_active: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ is_active: 1, category: 1 }); // Compound index for active posts by category
postSchema.index({ createdAt: -1 }); // For sorting by creation date

export const Post = model<TPost>('Post', postSchema);