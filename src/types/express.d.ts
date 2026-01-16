import { IUser } from "../models/user.model.js";

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}
