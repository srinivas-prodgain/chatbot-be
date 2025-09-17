import { Document, model, Schema } from "mongoose";


export const senders = ['user', 'assistant'] as const;
export type TSender = (typeof senders)[number];


export type TMessage = Document & {
    user_id: Schema.Types.ObjectId;
    message: string;
    sender: TSender;
    conversation_id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<TMessage>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: senders,
        required: true
    },
    conversation_id: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
}, {
    timestamps: true
});

export const Message = model('Message', messageSchema);
