import { Document, model, Schema } from "mongoose";

type TAuthor = Document & {
    name: string;
    email: string;
    profileImage: string;
    bio: string;
    role: string;
    socialLinks: {
        linkedin: string;
        twitter: string;
    };
    isActive: boolean;
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
    profileImage: {
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
    socialLinks: {
        linkedin: String,
        twitter: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Author = model('Author', authorSchema);