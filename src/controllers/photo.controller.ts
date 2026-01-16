import { Album } from "../models/album.model";
import { Photo } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteImageByPublicId, uploadOnCloudinary } from "../utils/Cloudinary";
import { ApiResponse } from "../utils/ApiResponse"
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request.js"

// upload image ✅
const uploadImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // req.files is array | { [fieldname: string]: Multer.File[] } | undefined
    // Assuming array upload
    const photos = req.files as Express.Multer.File[];
    const { description, location } = req.body;
    if (!req.user) throw new ApiError(401, "Not logged in");
    const userId = req.user._id;
    const uploadedPhotos = [];

    if (!photos || photos.length === 0) {
        throw new ApiError(400, 'No files uploaded')
    }

    for (const photo of photos) {
        const result = await uploadOnCloudinary(photo.path);
        if (!result) continue;
        const photoUploaded = await Photo.create({
            userId,
            url: result.url,
            description,
            location,
        });

        uploadedPhotos.push(photoUploaded);

    }

    res.status(200).json({
        message: 'Images uploaded successfully',
        photos: uploadedPhotos,
    });
});
const uploadSingleImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const photo = req.file;
    const { description, location, localAssetId, creationDateTime, height, width } = req.body;
    if (!req.user) throw new ApiError(401, "Not logged in");
    const userId = req.user._id;

    if (!photo) throw new ApiError(400, "File missing");

    const result = await uploadOnCloudinary(photo.path);
    const photoUploaded = await Photo.create({
        userId,
        url: result!.url,
        height,
        width,
        description,
        location,
        localAssetId,
        creationDateTime: parseInt(creationDateTime),
    });

    res.status(200).json(new ApiResponse(200, photoUploaded, "Image uploaded successfully"));

})
// Get all photo by user id ✅
const getAllPhotos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Not logged in");
    const id = req.user._id;
    const { page, limit } = req.query;

    if (!page || !limit) {
        return res.status(400).json({ message: 'Page and limit are required' });
    }

    const options = {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 30,
    };

    const myAggregate = Photo.aggregate([
        { $match: { userId: id } },
        { $sort: { createdAt: -1 } }
    ]);

    Photo.aggregatePaginate(myAggregate, options)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving photos", error });
        });
});
// delete by id ✔️
const deleteImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

    const _id = req.params.id;
    if (!req.user) throw new ApiError(401, "Not logged in");
    const photo = await Photo.findOneAndDelete({ _id, userId: req.user._id });
    if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
    }
    const publicId = photo.url.split('/').pop()?.split('.')[0] || "";
    await deleteImageByPublicId(publicId);
    res.status(200).json({ message: "Photo deleted successfully" });
});

const addPhotoToAlbum = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const albumId = req.params.id;
    const photoIdArray = req.body.photoIdArray;
    if (!req.user) throw new ApiError(401, "Not logged in");
    // Find the album by ID
    const album = await Album.findById(albumId);
    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    // Validate that all photo IDs exist and belong to the user
    const photos = await Photo.find({
        _id: { $in: photoIdArray },
        userId: req.user._id
    });

    if (photos.length !== photoIdArray.length) {
        return res.status(400).json({ message: "One or more photos not found or do not belong to the user" });
    }

    // Update the albumId field in each photo
    const updatedPhotos = await Photo.updateMany(
        { _id: { $in: photoIdArray } },
        { $set: { albumId: albumId } }
    );

    res.status(200).json({
        success: true,
        message: "Photos added to album successfully",
        updatedPhotos,
    });
});

// gat photos by in the range of startCreationDateTime and endCreationDateTime
const getPhotosByDateRange = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { startCreationDateTime, endCreationDateTime } = req.query;
    if (!startCreationDateTime || !endCreationDateTime) {
        return res.status(400).json(new ApiError(400, "startCreationDateTime and endCreationDateTime are required"));
    }
    if (!req.user) throw new ApiError(401, "Not logged in");

    const photos = await Photo.find({
        creationDateTime: {
            $lte: parseInt(startCreationDateTime as string),
            $gte: parseInt(endCreationDateTime as string),
        },
        userId: req.user._id
    });

    if (!photos.length) {
        return res.status(403).json(new ApiError(403, "No photos found in this date range"));
    }

    res.status(200).json(new ApiResponse(200, photos, "All photos are fetched in this date range successfully"));

})

export { uploadImages, getAllPhotos, deleteImage, addPhotoToAlbum, getPhotosByDateRange, uploadSingleImages };
