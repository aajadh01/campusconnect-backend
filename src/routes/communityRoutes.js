// src/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
  createPost,
  createAnnouncement,
  getAllPosts,
  replyToPost,
  votePost,
  deletePost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Create post
router.post('/create', upload.single('image'), createPost);

// Announcement
router.post('/announcement', createAnnouncement);

// Get all posts
router.get('/', getAllPosts);

// Reply
router.post('/:id/reply', replyToPost);

// Upvote/Downvote
router.put('/:id/:action', votePost);

// Delete
router.delete('/:id', deletePost);

module.exports = router;
