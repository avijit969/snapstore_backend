import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middeleware.js";
import {
    deleteImage,
    getAllPhotos,
    getPhotosByDateRange,
    uploadImages,
    uploadSingleImages
} from "../controllers/photo.controller.js";

const router = Router()
router.route("/upload").post(verifyJWT, upload.array('photos', 10), uploadImages)
router.route('/upload-single').post(verifyJWT, upload.single('photo'), uploadSingleImages)
router.route('/all-photo').get(verifyJWT, getAllPhotos)
router.route('/delete/:id').delete(verifyJWT, deleteImage)
router.route('/all-photos-by-date-range').get(verifyJWT, getPhotosByDateRange)
export default router