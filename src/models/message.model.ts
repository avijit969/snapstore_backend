import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    albumId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    isSeen: boolean;
    isDeleted: boolean;
    isEdited: boolean;
    isDelivered: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album"
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true // Assuming content is required
        },
        isSeen: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        isDelivered: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Message = mongoose.model<IMessage>('Message', messageSchema)