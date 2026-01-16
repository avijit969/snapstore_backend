import mongoose, { Schema, Document } from "mongoose";

export interface IAlbum extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    coverImage?: string;
    collaborators: {
        userId: mongoose.Types.ObjectId;
        joinedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
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
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                joinedAt: {
                    type: Date,
                    default: Date.now
                }
            }

        ]
    },
    {
        timestamps: true
    }
)
export const Album = mongoose.model<IAlbum>('Album', albumSchema)