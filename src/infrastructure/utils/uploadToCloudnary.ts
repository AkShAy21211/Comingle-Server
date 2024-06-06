import cloudinary from "../config/cloudnary";




const uploadSingle = (path: string, folder: string) => {
  return cloudinary.uploader
    .upload(path, {
      folder:`Comingle/${folder}`,
      format: "png"||"jpg"||"gif", // This will automatically detect the format based on the file extension
      resource_type: "image",
    })
    .then((data) => {
      // Construct the URL manually using the public ID
      const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;

      return { url, public_id: data.public_id };
    })
    .catch((error) => {
      console.log(error);
      throw null; 
    });
};


const uploadMultiple = (path: string, folder: string) => {
  return cloudinary.uploader
    .upload(path, {
      folder:`Comingle/${folder}`,
      format: "png"||"jpg"||"gif", // This will automatically detect the format based on the file extension
      resource_type: "image"||"video",
    })
    .then((data) => {
      // Construct the URL manually using the public ID
      const url = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/${data.public_id}.${data.format}`;

      return { url, public_id: data.public_id };
    })
    .catch((error) => {
      console.log(error);
      throw null; 
    });
};

export { uploadSingle,uploadMultiple };
