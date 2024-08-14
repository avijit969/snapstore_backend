import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createAlbum, deleteAlbum, getAlbumPhotos, getAllAlbums } from "../controllers/album.controller.js";
import { addPhotoToAlbum } from "../controllers/photo.controller.js";

const router = Router()
router.route('/create-album').post(verifyJWT, createAlbum)
router.route('/album/:id').delete(verifyJWT, deleteAlbum)
router.route('/album').get(verifyJWT,getAllAlbums)
router.route('/add-photo-to-album/:id').post(verifyJWT,addPhotoToAlbum)
router.route('/all-photos/:albumId').get(verifyJWT,getAlbumPhotos)
export default router