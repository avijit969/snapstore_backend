import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAlbumCoverImage, createAlbum, deleteAlbum, editAlbum, getAlbumPhotos, getAllAlbums } from "../controllers/album.controller.js";
import { addPhotoToAlbum } from "../controllers/photo.controller.js";

const router = Router()
router.route('/create-album').post(verifyJWT, createAlbum)
router.route('/album/:id').delete(verifyJWT, deleteAlbum)
router.route('/album').get(verifyJWT, getAllAlbums)
router.route('/add-photo-to-album/:id').post(verifyJWT, addPhotoToAlbum)
router.route('/all-photos/:albumId').get(verifyJWT, getAlbumPhotos)
router.route('/add-album-cover-image/:id').post(verifyJWT, addAlbumCoverImage)
router.route('/edit-album/:id').patch(verifyJWT, editAlbum)
export default router