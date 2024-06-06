import multer from 'multer';

const memoryStorage = multer.diskStorage({});

export const multerUploader = multer({ storage: memoryStorage })


