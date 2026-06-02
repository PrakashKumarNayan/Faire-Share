import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
    cloud_name: "dyxwydxlt",
    api_key: "214818582797752",
    api_secret: "tVBCEjk8PeCv06sX5pZ_yMbFasg"
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const resolvedPath = path.resolve(localFilePath);
        if (!fs.existsSync(resolvedPath)) {
            console.error("Cloudinary upload failed, local file missing:", resolvedPath);
            return null;
        }

        const response = await cloudinary.uploader.upload(resolvedPath, {
            resource_type: "auto"
        });

        if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
        }
        return response;
    } catch (error) {
        const resolvedPath = path.resolve(localFilePath);
        if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
        }
        console.error("Cloudinary upload error", error);
        return null;
    }
};


export { uploadOnCloudinary }