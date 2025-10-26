// src/routes/lostFoundRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { protect } = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  deletePost,
} = require('../controllers/lostFoundController');

router.use(protect);

router.post('/create', upload.single('image'), createPost);
router.get('/', getAllPosts);
router.delete('/:id', deletePost);

module.exports = router;
