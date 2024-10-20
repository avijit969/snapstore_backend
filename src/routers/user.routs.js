import { Router } from "express"
import {
  changePassword,
  getProfile,
  isLoggedIn,
  logOut,
  loginUser,
  registerUser,
  updateAvatar,
  updateUserInfo,
  sendOtpForForgotPassword,
  verifyOtpForForgotPassword,
  resendOtpForForgotPassword,
  forgotPassword
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middeleware.js"
const router = Router()
router.route("/registerUser").post(registerUser)
router.route("/login").post(loginUser)
router.route("/isLoggedIn").get(verifyJWT, isLoggedIn)
router.route("/logout").post(verifyJWT, logOut)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/profile").get(verifyJWT, getProfile)
router.route("/changePassword").patch(verifyJWT, changePassword)
router.route("/update-profile").patch(verifyJWT, upload.single("avatar"), updateUserInfo)

router.route("/send-otp-for-forgotPassword").post(verifyJWT, sendOtpForForgotPassword)
router.route("/verify-otp-for-forgotPassword").post(verifyJWT, verifyOtpForForgotPassword)
router.route("/resend-otp-for-forgotPassword").post(verifyJWT, resendOtpForForgotPassword)
router.route("/forgot-password").post(verifyJWT, forgotPassword)

export default router
