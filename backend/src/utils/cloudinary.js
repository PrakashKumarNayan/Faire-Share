import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: "dyxwydxlt",
    api_key: "214818582797752",
    api_secret: "tVBCEjk8PeCv06sX5pZ_yMbFasg"  // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //uploading file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully

        // console.log("File has been uploaded successfully in clodinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved file as upload process got failed
        console.error("Cloudinary upload error", error)
        return null;
    }
}


export { uploadOnCloudinary }