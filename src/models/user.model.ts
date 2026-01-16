import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export interface IUser extends Document {
    username: string;
    email: string;
    isAdmin: boolean;
    fullName: string;
    avatar: string;
    password?: string;
    refreshToken?: string;
    expoPushToken?: string;
    otp?: string;
    otp_expiry?: number;
    createdAt: Date;
    updatedAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      //   required: true,
      default: "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-854.jpg?w=900&t=st=1714227599~exp=1714228199~hmac=3c7441e3d076b9d93e4c6acfaf17ff113290eef786ad9f1f61316ed7df630919"
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
    expoPushToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otp_expiry: {
      type: Number,
    },

  },
  {
    timestamps: true, // createdAt
  }
)

userSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) return next();

  if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    if (!this.password) return false;
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  const options: jwt.SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "1d") as any,
  };
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET || "",
    options
  )
}

userSchema.methods.generateRefreshToken = function () {
  const options: jwt.SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "10d") as any,
  };
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "",
    options
  )
}

export const User = mongoose.model<IUser>("User", userSchema)
