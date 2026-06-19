const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_MIME = /^(image\/(jpeg|png|gif|webp|svg\+xml)|video\/(mp4|webm|quicktime)|audio\/(webm|ogg|mp4|mpeg|wav|aac))$/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomBytes(14).toString('hex')}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, ALLOWED_MIME.test(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
