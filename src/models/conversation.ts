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

export const Conversation = model('Conversation', conversationSchema);