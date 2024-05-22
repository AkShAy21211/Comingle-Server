import cloudinary from "../config/cloudnary";


const uploadProfileBackground = async (
   image: any
):Promise<any> => {
  try {


      const responseFromCd = await cloudinary.uploader.upload(image.image, {
        folder: `Comingle/backgrounds`,
      });
      return {
        public_id: responseFromCd.public_id,
        type:image.type,
        secure_url: responseFromCd.secure_url,
      };
  
  } catch (error) {
    console.log("Error occurred when uploading images to Cloudinary.", error);

  }
};

export default uploadProfileBackground;
