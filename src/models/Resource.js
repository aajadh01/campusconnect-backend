// src/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String },
    branch: { type: String },
    semester: { type: String },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    fileType: { type: String }, // e.g. pdf, image, docx
    fileName: { type: String },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderRole: {
      type: String,
      enum: ['student', 'faculty', 'organizer', 'admin'],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, // Faculty can mark this true later
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
