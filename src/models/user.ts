import { Document, model, Schema } from "mongoose";

import { USER_THEMES, USER_LANGUAGES } from "@/constants/user";
import { TUserTheme, TUserLanguage } from "@/types/user";


type TUser = Document & {
    preferences: {
        theme: TUserTheme;
        language: TUserLanguage;
    };
}


const userSchema = new Schema<TUser>({
    preferences: {
        theme: {
            type: String,
            enum: USER_THEMES,
            default: USER_THEMES[0]
        },
        language: {
            type: String,
            enum: USER_LANGUAGES,
            default: USER_LANGUAGES[0]
        }
    }
}, {
    timestamps: true
});

// Create indexes for optimized queries
userSchema.index({ createdAt: -1 }); // For sorting by registration date

export const User = model<TUser>('User', userSchema);