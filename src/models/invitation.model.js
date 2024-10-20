import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema(
    {
        albumId: {
            type: mongoose.Types.ObjectId,
            ref: "Album"
        },
        senderId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        isSeen: {
            type: Boolean,
            default: false
        },
        respondedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

export const Invitation = mongoose.model('Invitation', invitationSchema)