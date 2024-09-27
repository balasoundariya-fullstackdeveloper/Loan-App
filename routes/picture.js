const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads/product');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to handle image upload
router.post('/add-transaction', upload.array('image'), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  res.send('Images uploaded successfully');
});

// Route to serve images
router.get('/images/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });
});

module.exports = router;
