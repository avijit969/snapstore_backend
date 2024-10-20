import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        albumId: {
            type: mongoose.Types.ObjectId,
            ref: "Album"
        },
        senderId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
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

export const Message = mongoose.model('Message', messageSchema)