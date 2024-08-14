import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middeleware.js";
import { deleteImage, getAllPhotos, uploadImages } from "../controllers/photo.controller.js";

const router = Router()
router.route("/upload").post(verifyJWT, upload.array('photos', 10), uploadImages)
router.route('/all-photo').get(verifyJWT, getAllPhotos)
router.route('/delete/:id').delete(verifyJWT, deleteImage)
export default router