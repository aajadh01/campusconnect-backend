// src/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    fileType: { type: String }, // e.g. pdf, image, docx
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderRole: {
      type: String,
      enum: ['student', 'faculty'],
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    verified: {
      type: Boolean,
      default: false, // Faculty can mark this true later
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
