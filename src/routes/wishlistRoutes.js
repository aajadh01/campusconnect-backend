// src/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistController');

router.use(protect);

router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.get('/', getWishlist);

module.exports = router;
