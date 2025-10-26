const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file MIME type
    let resourceType = "auto"
    const mimeType = file.mimetype.toLowerCase()

    // PDFs and documents should use 'raw' resource type
    if (
      mimeType === "application/pdf" ||
      mimeType.includes("document") ||
      mimeType.includes("word") ||
      mimeType.includes("sheet") ||
      mimeType.includes("presentation")
    ) {
      resourceType = "raw"
    }
    // Images should use 'image' resource type
    else if (mimeType.startsWith("image/")) {
      resourceType = "image"
    }
    // Videos should use 'video' resource type
    else if (mimeType.startsWith("video/")) {
      resourceType = "video"
    }

    return {
      folder: "campusconnect_uploads", // all files stored in this folder
      resource_type: resourceType, // Dynamically set based on file type
      public_id: file.originalname.split(".")[0], // use file name as public id
    }
  },
})

const upload = multer({ storage })

module.exports = upload
