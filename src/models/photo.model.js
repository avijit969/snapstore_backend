import mongoose, { Schema } from "mongoose";
import aggregatePaginate  from "mongoose-aggregate-paginate-v2";

const photoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
            // required: true,
        },
        url: {
            type: String,
            required: true,
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
        }
    },
    {
        timestamps: true,
    }
);
photoSchema.plugin(aggregatePaginate)

export const Photo = mongoose.model('Photo', photoSchema);
