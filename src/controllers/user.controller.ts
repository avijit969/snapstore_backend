import { Photo } from "../models/photo.model"
import { User, IUser } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/Cloudinary"
import { asyncHandler } from "../utils/asyncHandler"
import { compareOtp, generateOTP, hashOtp } from "../utils/hasOTP"
import { sendOtpByMail } from "../utils/sendOtpByMail"
import { Request, Response } from "express"
import { AuthenticatedRequest } from "../types/authenticated-request"

const generateAccessAndRefreshTokens = async (userId: string | unknown) => {
  try {
    const user = await User.findById(userId)
    if (!user) throw new ApiError(500, "User not found")
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    )
  }
}

// user registration ✅
const registerUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, email, username, password } = req.body
  console.log(fullName, email, username, password)
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  })
  if (existedUser) {
    throw new ApiError(401, "User with email or username already exists")
  }
  const user = await User.create({
    email,
    fullName,
    password,
    username,
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"))
})

// user login  ✅
const loginUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    throw new ApiError(400, "Username and Password is required !")
  }
  const user = await User.findOne({ username })
  if (!user) {
    throw new ApiError(401, "user does not exist !")
  }
  const isPAsswordCorrect = await user.isPasswordCorrect(password)
  if (!isPAsswordCorrect) {
    throw new ApiError(402, "invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  )
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    )
})

const getUser=asyncHandler(async(req:AuthenticatedRequest,res:Response)=>{
  const userId = req.user?._id;
  const user=await User.findById(userId).select("-password -refreshToken")
  if(!user){
    throw new ApiError(404,"User not found")
  }
  return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"))
})

// user logOut ✅
const logOut = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not logged in")
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged Out"))
})

// update avatar image ✅
const updateAvatar = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading avatar")
  }
  if (!req.user) throw new ApiError(401, "Not logged in");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken")
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image is updated successfully"))
})
//get user details ✅
const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not logged in");
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  )
  if (!user) {
    throw new ApiError(400, "No such user exists!")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Successfully fetched the profile!"))
})

//change user password ✅
const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body
  if (!req.user) throw new ApiError(401, "Not logged in");
  const user = await User.findById(req.user._id)
  if (!user) throw new ApiError(404, "User not found")
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect current Password")
  }
  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})
// update  user info ✅
const updateUserInfo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, fullName, username } = req.body;
  const avatarLocalPath = req.file?.path;
  if (!req.user) throw new ApiError(401, "Not logged in");

  // Find the current user
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  // Handle avatar upload if a new avatar is provided
  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) {
      throw new ApiError(400, "Error while uploading avatar");
    }
  }

  // Email validation: only check if the email is changing
  if (email && email !== currentUser.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, "Email already exists");
    }
  }

  // Username validation: only check if the username is changing
  if (username && username !== currentUser.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError(400, "Username already exists, try another one");
    }
  }

  // Update user details
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email: email || currentUser.email,
        fullName: fullName || currentUser.fullName,
        username: username || currentUser.username,
        avatar: avatar?.url || currentUser.avatar,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});


// forgot password with email OTP
const sendOtpForForgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body
  console.log(email)
  const user = await User.findOne({ email })
  console.log(user)
  if (!user) {
    throw new ApiError(400, "User with this email does not exist")
  }
  const otp = generateOTP()
  const hashedOtp = hashOtp(otp.toString())
  user.otp = hashedOtp
  user.otp_expiry = Date.now() + 10 * 60 * 1000
  await user.save()
  sendOtpByMail(otp, email)
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP has been sent to your email"))
})

// verify otp
const verifyOtpForForgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { otp } = req.body
  if (!req.user) throw new ApiError(401, "Not logged in/User not found in req");
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new ApiError(400, "User with this email does not exist")
  }
  const hashedOtp = user.otp || ""
  if (compareOtp(otp.toString(), hashedOtp)) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP has been verified"))
  }
  else {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid OTP"))
  }
})

// resend otp 
const resendOtpForForgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Not logged in/User not found in req");
  const user = await User.findById(req.user._id)
  if (!user) throw new ApiError(404, "User not found")
  const otp = generateOTP()
  const hashedOtp = hashOtp(otp.toString())
  user.otp = hashedOtp
  user.otp_expiry = Date.now() + 10 * 60 * 1000
  await user.save()
  sendOtpByMail(otp, user.email)
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP has been sent to your email"))
})
// forgot password
const forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password } = req.body
  if (!req.user) throw new ApiError(401, "Not logged in/User not found in req");
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new ApiError(400, "User with this email does not exist")
  }
  user.password = password
  await user.save()
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})
export {
  registerUser,
  loginUser,
  logOut,
  updateAvatar,
  getProfile,
  changePassword,
  updateUserInfo,
  getUser,
  sendOtpForForgotPassword,
  resendOtpForForgotPassword,
  verifyOtpForForgotPassword,
  forgotPassword,
}
