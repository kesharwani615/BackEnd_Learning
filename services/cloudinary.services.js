import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';;

export const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })

        //file has been successfully uploaded
        console.log("file successfully uploaded",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove temporary file from local
        
    }
}