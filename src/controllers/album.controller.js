import { json } from "express";
import { Album } from "../models/album.model.js";
import { Photo } from "../models/photo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


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

const addAlbumCoverImage = asyncHandler(async (req, res) => {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);
    if (!album) {
        return res.status(404).json(new ApiError(404, "Album not found"));
    }
    const photo = await Photo.findById(req.body.photoId);
    if (!photo) {
        return res.status(404).json(new ApiError(404, "Photo not found"));
    }
    album.coverImage = photo.url;
    await album.save();
    res.status(200).json(new ApiResponse(200, album, "Album cover image added successfully"));
})

const editAlbum = asyncHandler(async (req, res) => {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);
    if (!album) {
        return res.status(404).json(new ApiError(404, "Album not found"));
    }

    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json(new ApiError(400, "Name and description are required"));
    }
    // update the album
    const updatedAlbum = await Album.updateOne({ _id: albumId }, {
        name,
        description
    })
    if (!updatedAlbum) {
        return res.status(500).json(new ApiError(500, "Failed to update album"));
    }

    res.status(200).json(new ApiResponse(200, updatedAlbum, "Album updated successfully"));
})

export {
    createAlbum,
    deleteAlbum,
    getAllAlbums,
    getAlbumPhotos,
    addAlbumCoverImage,
    editAlbum
}