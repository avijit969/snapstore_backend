import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            require: true
        },
        description: {
            type: String
        },
        coverImage: {
            type: String
        },
        collaborators: [
            {
                userId: {
                    type: mongoose.Types.ObjectId,
                    ref: "User"
                },
                joinedAt: {
                    type: Date,
                    default: Date.now()
                }
            }

        ]
    },
    {
        timestamps: true
    }
)
export const Album = mongoose.model('Album', albumSchema)