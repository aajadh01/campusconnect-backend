// src/controllers/communityController.js
const asyncHandler = require('express-async-handler');
const CommunityPost = require('../models/CommunityPost');

// 🟢 Create new post
exports.createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Post content is required');
  }

  let imageUrl = null;
  if (req.file) imageUrl = req.file.path;

  const post = await CommunityPost.create({
    content,
    imageUrl,
    postedBy: req.user._id,
    type: 'post',
  });

  res.status(201).json({ message: 'Post created', post });
});

// 📢 Organizer/Admin announcement
exports.createAnnouncement = asyncHandler(async (req, res) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only organizers or admins can post announcements');
  }

  const { content } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Announcement content required');
  }

  const post = await CommunityPost.create({
    content,
    postedBy: req.user._id,
    type: 'announcement',
  });

  res.status(201).json({ message: 'Announcement posted', post });
});

// 🟡 Get all posts (includes announcements)
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find()
    .populate('postedBy', 'fullName role registeredId')
    .sort({ createdAt: -1 });

  res.json({ count: posts.length, posts });
});

// 💬 Reply to a post
exports.replyToPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  post.replies.push({
    user: req.user._id,
    message,
  });

  await post.save();
  res.json({ message: 'Reply added', replies: post.replies });
});

// 👍 Upvote or 👎 Downvote
exports.votePost = asyncHandler(async (req, res) => {
  const { action } = req.params; // "upvote" or "downvote"
  const post = await CommunityPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const userId = req.user._id;

  if (action === 'upvote') {
    post.downvotes.pull(userId);
    if (post.upvotes.includes(userId)) {
      post.upvotes.pull(userId);
    } else {
      post.upvotes.push(userId);
    }
  } else if (action === 'downvote') {
    post.upvotes.pull(userId);
    if (post.downvotes.includes(userId)) {
      post.downvotes.pull(userId);
    } else {
      post.downvotes.push(userId);
    }
  }

  await post.save();
  res.json({
    message: 'Vote updated',
    upvotes: post.upvotes.length,
    downvotes: post.downvotes.length,
  });
});

// 🗑️ Delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
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
