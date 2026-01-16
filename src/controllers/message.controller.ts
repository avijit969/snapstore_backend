import { Message } from "../models/message.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request"

const createMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userId = req.user._id;
    const {albumId} = req.params
    const {content} = req.body
    const message = await Message.create({
        albumId,
        senderId: userId,
        content,
    })
    res.status(201).json(message);
})

export { createMessage }