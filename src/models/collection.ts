import { Document, model, Schema } from "mongoose";


type TCollection = Document & {
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

export const Collection = model('Collection', CollectionSchema);