import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
};

const upload = multer({storage:storage, fileFilter:fileFilter});

export default upload