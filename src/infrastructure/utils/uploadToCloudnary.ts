import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudnary";
import fs from "fs";

const uploadProfile = async (
  file: Express.Multer.File,
  folderName: string
): Promise<{ public_id: string; secure_url: string }> => {
  try {
    // Upload file to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Comingle/" + folderName,
            resource_type: "auto", // auto-detects the resource type (image, video, audio)
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

    // Delete the file from the local filesystem after uploading to Cloudinary
    await fs.unlink(file.path, (err) => {
      console.log(err);
    });

    return {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    };
  } catch (error: any) {
    throw new Error(`Error uploading and saving file: ${error.message}`);
  }
};

// const uploadProfile = (path: string, folder: string) => {
//   return cloudinary.uploader
//     .upload(path, {
//       folder:`Comingle/${folder}`,
//       allowed_formats: ['jpg', 'png', 'gif', 'pdf', 'mp3', 'mp4'],
//       resource_type: "image"||"video",
//     })
//     .then((data) => {
//       // Construct the URL manually using the public ID
//       const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;

//       return { url, public_id: data.public_id };
//     })
//     .catch((error) => {
//       console.log(error);
//       throw null;
//     });
// };

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
      resource: uploadResult.resource_type,
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
