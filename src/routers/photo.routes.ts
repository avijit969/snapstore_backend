import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
    deleteImage,
    getAllPhotos,
    getPhotosByDateRange,
    uploadImages,
    uploadSingleImages
} from "../controllers/photo.controller";

const router = Router()
router.route("/upload").post(verifyJWT, upload.array('photos', 10), uploadImages)
router.route('/upload-single').post(verifyJWT, upload.single('photo'), uploadSingleImages)
router.route('/all-photo').get(verifyJWT, getAllPhotos)
router.route('/delete/:id').delete(verifyJWT, deleteImage)
router.route('/all-photos-by-date-range').get(verifyJWT, getPhotosByDateRange)
export default router