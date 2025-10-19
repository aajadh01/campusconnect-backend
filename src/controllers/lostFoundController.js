// src/controllers/lostFoundController.js
const asyncHandler = require('express-async-handler');
const LostFound = require('../models/LostFound');

// 📤 Create new post
exports.createPost = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  const { title, description, status } = req.body;
  const post = await LostFound.create({
    title,
    description,
    status,
    imageUrl: req.file.path,
    postedBy: req.user._id,
  });

  res.status(201).json({ message: 'Post created', post });
});

// 📚 Get all posts
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await LostFound.find()
    .populate('postedBy', 'fullName role registeredId')
    .sort({ createdAt: -1 });

  res.json({ count: posts.length, posts });
});

// 🗑️ Delete own post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await LostFound.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (
    post.postedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
});
