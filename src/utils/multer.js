// src/utils/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'campusconnect_uploads', // all files stored in this folder
      resource_type: 'auto', // handles images, pdf, etc.
      public_id: file.originalname.split('.')[0], // use file name as public id
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
