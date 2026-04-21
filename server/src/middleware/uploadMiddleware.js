const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', 'vendorCertificates');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, PNG, and JPEG files are allowed for certificate upload.'));
  }
};

const uploadCertificate = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});

module.exports = {
  uploadCertificate
};
