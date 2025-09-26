import { Document, model, Schema } from "mongoose";


export type TCollection = Document & {
    title: string;
    description: string;
    slug: string;
    icon: string;
    parent_collection?: Schema.Types.ObjectId;
    level: number;
    is_published: boolean;
    total_articles: number;
}

const CollectionSchema = new Schema<TCollection>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    icon: String,
    parent_collection: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        default: null
    },
    level: {
        type: Number,
        default: 0  // 0 for root, 1 for first sub, 2 for second sub, etc.
    },
    is_published: {
        type: Boolean,
        default: true
    },
    total_articles: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Create indexes for optimized queries
CollectionSchema.index({ parent_collection: 1 });
CollectionSchema.index({ level: 1 });
CollectionSchema.index({ is_published: 1 });
CollectionSchema.index({ parent_collection: 1, level: 1 }); // Compound index for hierarchical queries
CollectionSchema.index({ is_published: 1, level: 1 }); // Compound index for published collections by level
CollectionSchema.index({ total_articles: -1 });
CollectionSchema.index({ is_published: 1, level: 1, createdAt: -1, _id: -1 }); // Compound index for cursor-based pagination

export const Collection = model<TCollection>('Collection', CollectionSchema);