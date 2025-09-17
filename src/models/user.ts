import { Document, model, Schema } from "mongoose";


export const themes = ['light', 'dark'] as const;
export const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'] as const;

type TLanguage = (typeof languages)[number];
type TTheme = (typeof themes)[number];


type TUser = Document & {
    preferences: {
        theme: TTheme;
        language: TLanguage;
    };
}


const userSchema = new Schema<TUser>({
    preferences: {
        theme: {
            type: String,
            enum: themes,
            default: themes[0]
        },
        language: {
            type: String,
            enum: languages,
            default: languages[0]
        }
    }
}, {
    timestamps: true
});

// Create indexes for optimized queries
userSchema.index({ createdAt: -1 }); // For sorting by registration date

export const User = model<TUser>('User', userSchema);