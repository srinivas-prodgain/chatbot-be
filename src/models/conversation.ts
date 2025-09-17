import { Document, model, Schema } from "mongoose";


export const statuses = ['active', 'inactive', 'archived'] as const;
type TStatus = (typeof statuses)[number];



export type TConversation = Document & {
    title: string;
    user_id: Schema.Types.ObjectId;
    status: TStatus;
}


const conversationSchema = new Schema<TConversation>({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: statuses,
        default: 'active'
    }
}, {
    timestamps: true
});

// Create indexes for optimized queries
conversationSchema.index({ status: 1 });
conversationSchema.index({ user_id: 1, status: 1 }); // Compound index for user conversations by status
conversationSchema.index({ createdAt: -1 }); // For sorting by creation date
conversationSchema.index({ updatedAt: -1 }); // For sorting by last activity

export const Conversation = model<TConversation>('Conversation', conversationSchema);