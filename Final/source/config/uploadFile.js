const multer = require('multer');
const path = require('path');

// Khởi tạo middleware Multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// Tạo middleware multer
const upload = multer({ storage: storage })

module.exports = upload;

