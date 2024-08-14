import mongoose, { Schema } from "mongoose";
import aggregatePaginate  from "mongoose-aggregate-paginate-v2";

const photoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, // Assuming userId is required
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
            // required: true, // Assuming albumId is required
        },
        url: {
            type: String,
            required: true, // Corrected key from 'require' to 'required'
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
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);
photoSchema.plugin(aggregatePaginate)
// Corrected export statement
export const Photo = mongoose.model('Photo', photoSchema);
