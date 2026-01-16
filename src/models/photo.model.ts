import mongoose, { Schema, Document, AggregatePaginateModel } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IPhoto extends Document {
    userId: mongoose.Types.ObjectId;
    albumId?: mongoose.Types.ObjectId;
    url: string;
    height?: number;
    width?: number;
    description?: string;
    location?: string;
    isFavorite: boolean;
    localAssetId: string;
    creationDateTime: number;
    createdAt: Date;
    updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            // required: true,
        },
        url: {
            type: String,
            required: true,
        },
        height: {
            type: Number,
        },
        width: {
            type: Number,
        },
        description: {
            type: String,
        },
        location: {
            type: String,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        localAssetId: {
            type: String,
            required: true
        },
        creationDateTime: {
            type: Number,
            required: true
        },

    },
    {
        timestamps: true,
    }
);
photoSchema.plugin(aggregatePaginate);

interface IPhotoModel extends AggregatePaginateModel<IPhoto> {}

export const Photo = mongoose.model<IPhoto, IPhotoModel>('Photo', photoSchema);
