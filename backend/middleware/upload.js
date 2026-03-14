const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const s3 = require('../config/s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const key = `items/${uuidv4()}${ext}`;
      cb(null, key);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

module.exports = upload;
