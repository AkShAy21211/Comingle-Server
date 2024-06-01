// middlewares/profileUploader.js
import multer from 'multer';


const memoryStorage = multer.memoryStorage();

export const profileUploader = multer({ storage: memoryStorage }).single('image');
