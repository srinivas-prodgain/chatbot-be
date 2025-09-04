import { Document, model, Schema } from "mongoose";


type TCollection = Document & {
    title: string;
    description: string;
    slug: string;
    icon: string;
    parentCollection?: Schema.Types.ObjectId;
    level: number;
    isPublished: boolean;
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
    parentCollection: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        default: null
    },
    level: {
        type: Number,
        default: 0  // 0 for root, 1 for first sub, 2 for second sub, etc.
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Collection = model('Collection', CollectionSchema);