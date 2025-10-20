// src/routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
  uploadResource,
  getAllResources,
  upvoteResource,
  deleteResource,
  verifyResource,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

// All resource routes require login
router.use(protect);

// Upload new resource
router.post('/upload', upload.single('file'), uploadResource);

// Get all resources
router.get('/', getAllResources);

// Upvote
router.put('/:id/upvote', upvoteResource);

// Delete
router.delete('/:id', deleteResource);

// Verify (faculty or admin only)
router.put('/:id/verify', verifyResource);

module.exports = router;
