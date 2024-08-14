import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded succesfully
    console.log("flie is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath); // remove the locally tepmorarly saved file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally tepmorarly saved file
  }
};

const deleteImageByPublicId = (url) => {
  cloudinary.uploader.destroy(url, (error, result) => {
    if (error) console.error(error);
  })
}
export { uploadOnCloudinary ,deleteImageByPublicId} 
