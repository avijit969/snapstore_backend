import { Request } from "express";
import { IUser } from "../models/user.model.js";

export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
