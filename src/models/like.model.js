import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId
        },
        photoId: {
            type: mongoose.Types.ObjectId
        }
    },
    {
        timestamps: true
    }
)
export const Like = mongoose.model('Like', likeSchema);