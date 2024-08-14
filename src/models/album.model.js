import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref:"User"
        },
        name: {
            type: String,
            require: String
        },
        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export const Album = mongoose.model('Album', albumSchema)