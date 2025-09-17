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

// Create indexes for optimized queries
authorSchema.index({ email: 1 }); // Email is already unique, but explicit index for lookups
authorSchema.index({ is_active: 1 });
authorSchema.index({ role: 1 });
authorSchema.index({ is_active: 1, role: 1 }); // Compound index for active authors by role
authorSchema.index({ name: 1 }); // For searching authors by name

export const Author = model<TAuthor>('Author', authorSchema);