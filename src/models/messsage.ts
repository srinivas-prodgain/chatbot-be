import { Document, model, Schema } from "mongoose";


export const senders = ['user', 'assistant'] as const;
type TSender = (typeof senders)[number];


type TMessage = Document & {
    userId: Schema.Types.ObjectId;
    message: string;
    sender: TSender;
    conversationId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<TMessage>({
    userId: {
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
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    }
}, {
    timestamps: true
});

export const Message = model('Message', messageSchema);