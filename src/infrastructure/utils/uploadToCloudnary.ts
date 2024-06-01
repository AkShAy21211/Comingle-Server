// controllers/profileController.js
import { profileUploader } from '../middleware/multer';
import cloudinary from '../config/cloudnary';
export const uploadProfile = async (req:any, res:any) => {
   profileUploader(req, res, async (err:any) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    console.log(req.body);
    
    const type = req.body.type;
    let folder = type === 'background' ? 'Comingle/backgrounds' : 'Comingle/profiles';
    let publicId = `file_${Date.now()}_${req.file.originalname}`;
    let allowedFormats = ['png', 'jpg', 'jpeg', 'gif'];

    try {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: publicId,
          allowed_formats: allowedFormats,
        },
        (error, result) => {
          if (error) {
            return res.status(400).send({ error: error.message });
          }
          console.log(result);
          
        }
      ).end(req.file.buffer);
    } catch (error:any) {
      res.status(500).send({ error: error.message });
    }
  });
};
