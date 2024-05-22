// middlewares/profileUploader.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudnary';  

const profileStorage = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: (req, file) => {
    
    const type = req.body.type;  
    let folder = type === 'background' ? 'Comingle/backgrounds' : 'Comingle/profiles';
    let publicId = `file_${Date.now()}_${file.originalname}`;
    let allowedFormats = ['png', 'jpg','jpeg','gif'];

    return {
      folder: folder,
      allowed_formats: allowedFormats,
      public_id: publicId,
    };
  },
});

export const profileUploader = multer({ storage: profileStorage });
