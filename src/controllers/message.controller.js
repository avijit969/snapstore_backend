import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { Invitation } from "../models/invitation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMessage = asyncHandler(async (req,res)=>{
    const {userId} = req.user
    const {albumId} = req.params
    const {content} = req.body
    await Message.create({
        albumId,
        senderId: userId,
        content,
    })
    
})