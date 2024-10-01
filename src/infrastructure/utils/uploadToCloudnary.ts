import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudnary";
import fs from "fs";



const uploadProfile = (path: string, folder: string) => {
  return cloudinary.uploader
    .upload(path, {
      folder:`Comingle/${folder}`,
      allowed_formats: ['jpg', 'png', 'gif', 'pdf', 'mp3', 'mp4',"webp"],
      resource_type: "auto",
    })
    .then((data) => {
    
      const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;

      return { url };
    })
    .catch((error) => {
      console.log(error);
      throw null;
    });
};

const uploadChats = async (file: Express.Multer.File, folderName: string) => {
  try {
    
    // Upload file to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Comingle/" + folderName,
            resource_type: "auto",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        const fileStream = fs.createReadStream(file.path);

        fileStream.pipe(stream);
      }
    );

   

    
    return {
      url: uploadResult.secure_url,
      resource: uploadResult.is_audio?"audio":uploadResult.format==="pdf"?'pdf':uploadResult.resource_type,
    };
  } catch (error: any) {
    throw new Error(`Error uploading and saving file: ${error.message}`);
  }
};

const uploadPosts = async (file: Express.Multer.File, folderName: string) => {
  try {
    // Upload file to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Comingle/" + folderName,
            resource_type: "auto",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        const fileStream = fs.createReadStream(file.path);

        fileStream.pipe(stream);
      }
    );

   
    return {
      url: uploadResult.secure_url,
      resource: uploadResult.resource_type,
    };
  } catch (error: any) {
    throw new Error(`Error uploading and saving file: ${error.message}`);
  }
};
export { uploadProfile, uploadPosts ,uploadChats};
