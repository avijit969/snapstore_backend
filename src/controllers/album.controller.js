import { Album } from "../models/album.model.js";
import { Photo } from "../models/photo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// crate the album of photos
const createAlbum = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const { name, description } = req.body;
    if (!name || !description) {
        res.status(400).json({ "message": "name and description is required" })
    }
    const album = await Album.create({ userId: _id, name, description })
    res.status(201).json(new ApiResponse(201, album, "album crated successfully"));
})

// delete album
const deleteAlbum = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const albumId = req.params.id;
    const album = await Album.findByIdAndDelete({ _id: albumId, userId: _id });
    if (!album) {
        res.status(404).json({ "message": "album not found" })
    }
    res.status(200).json(new ApiResponse(200, album, "album deleted successfully"));
})
// get all albums
const getAllAlbums = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const albums = await Album.find({ userId: _id });
    res.status(200).json(new ApiResponse(200, albums, "all albums retrieved successfully"));
})

// get all photo of the album
const getAlbumPhotos = asyncHandler(async (req, res) => {
    const userId = req.user._id; // ID of the current user
    const albumId = req.params.albumId; // ID of the album from the request parameters

    // Fetch photos belonging to the album and the user
    const photos = await Photo.find({ albumId, userId });

    if (!photos.length) {
        return res.status(404).json(new ApiResponse(404, [], "No photos found in this album"));
    }

    res.status(200).json(new ApiResponse(200, photos, "All photos of the album"));
});

export {
    createAlbum,
    deleteAlbum,
    getAllAlbums,
    getAlbumPhotos
}