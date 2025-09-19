import { Document, model, Schema } from "mongoose";

import { MESSAGE_SENDERS } from "@/constants/message";
import { TMessageSender } from "@/types/message";


export type TMessage = Document & {
    user_id: Schema.Types.ObjectId;
    message: string;
    sender: TMessageSender;
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
        enum: MESSAGE_SENDERS,
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

// Create indexes for optimized queries
messageSchema.index({ user_id: 1 });
messageSchema.index({ conversation_id: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ conversation_id: 1, createdAt: 1 }); // Compound index for chronological messages in conversation
messageSchema.index({ user_id: 1, createdAt: -1 }); // Compound index for user messages sorted by date
messageSchema.index({ conversation_id: 1, sender: 1 }); // Compound index for filtering by sender in conversation

export const Message = model<TMessage>('Message', messageSchema);
