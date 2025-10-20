// src/controllers/resourceController.js
const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

// 📤 Upload a new note
exports.uploadResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('File is required');
  }

  const { title, description, subject, branch, semester } = req.body;
  const resource = await Resource.create({
    title,
    description,
    subject,
    branch,
    semester,
    fileUrl: req.file.path, // Cloudinary gives this URL
    fileType: req.file.mimetype,
    fileName: req.file.originalname,
    uploadedBy: req.user._id,
    uploaderRole: req.user.role,
  });

  res.status(201).json({
    message: 'Resource uploaded successfully',
    resource,
  });
});

// 📚 Get all notes
exports.getAllResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find()
    .populate('uploadedBy', 'fullName regNumber role')
    .sort({ createdAt: -1 });

  res.json({ count: resources.length, resources });
});

// 👍 Upvote a note
exports.upvoteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Simple increment/decrement for upvotes count
  resource.upvotes += 1; // Frontend handles toggle logic

  await resource.save();
  res.json({ message: 'Upvote updated', upvotes: resource.upvotes });
});

// 🗑️ Delete own note
exports.deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // only uploader or admin can delete
  if (
    resource.uploadedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  await resource.deleteOne();
  res.json({ message: 'Resource deleted successfully' });
});

// ✅ Faculty verify note
exports.verifyResource = asyncHandler(async (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only faculty or admin can verify notes');
  }

  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  resource.verified = true;
  await resource.save();

  res.json({ message: 'Resource verified successfully' });
});
