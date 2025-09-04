import { Document, model, Schema } from "mongoose";


export const statuses = ['active', 'inactive', 'archived'] as const;
type TStatus = (typeof statuses)[number];



type TConversation = Document & {
    title: string;
    userId: Schema.Types.ObjectId;
    status: TStatus;
    summary: string;
    summary_version: number;
    last_summarized_message_index: number;
    last_token_count: number;
}


const conversationSchema = new Schema<TConversation>({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: statuses,
        default: 'active'
    },
    summary: {
        type: String,
        required: false,
        default: "",
    },
    summary_version: {
        type: Number,
        required: false,
        default: 0,
    },
    last_summarized_message_index: {
        type: Number,
        default: 0,
        required: false,
    },
    last_token_count: {
        type: Number,
        default: 0,
        required: false,
    },

}, {
    timestamps: true
});

export const Conversation = model('Conversation', conversationSchema);