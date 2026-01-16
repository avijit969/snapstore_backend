import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { Request, NextFunction } from "express";

import { AuthenticatedRequest } from "../types/authenticated-request.js";

interface DecodedToken {
    _id: string;
}

export const verifyJWT = asyncHandler(async (req: AuthenticatedRequest, _, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as DecodedToken;
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        throw new ApiError(401, "invalid access Token");
      }
      req.user = user;
      next()
    } catch (error: any) {
      throw new ApiError(400,error?.message || "invalid access Token")
    }
  });
