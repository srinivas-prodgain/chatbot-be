import { Document, model, Schema } from "mongoose";

type TAuthor = Document & {
    name: string;
    email: string;
    profile_image: string;
    bio: string;
    role: string;
    social_links: {
        linkedin: string;
        twitter: string;
    };
    is_active: boolean;
}


const authorSchema = new Schema<TAuthor>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    profile_image: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxLength: 500
    },
    role: {
        type: String,
        required: true
    },
    social_links: {
        linkedin: String,
        twitter: String
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Author = model('Author', authorSchema);