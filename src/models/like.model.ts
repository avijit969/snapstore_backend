import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    photoId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true // Assuming required based on previous simplified schema logic usually needing it
        },
        photoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
)
export const Like = mongoose.model<ILike>('Like', likeSchema);