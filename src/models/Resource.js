// src/models/Resource.js
const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    description: { type: String },
    branch: { type: String },
    semester: { type: String },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    fileName: { type: String },
    fileType: { type: String }, // e.g. pdf, image, docx
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploaderName: String,
    uploaderRole: {
      type: String,
      enum: ["student", "faculty", "organizer", "admin"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Resource", resourceSchema)
