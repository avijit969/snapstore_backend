import mongoose, { Schema, Document } from "mongoose";

export interface IInvitation extends Document {
    albumId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    isSeen: boolean;
    respondedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
    {
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album"
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
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

export const Invitation = mongoose.model<IInvitation>('Invitation', invitationSchema)