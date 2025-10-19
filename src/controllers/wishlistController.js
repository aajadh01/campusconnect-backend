// src/controllers/wishlistController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ➕ Add a resource to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.wishlist.includes(resourceId)) {
    user.wishlist.push(resourceId);
    await user.save();
  }

  res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
});

// ➖ Remove a resource
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { resourceId } = req.body;

  const user = await User.findById(req.user._id);
  user.wishlist.pull(resourceId);
  await user.save();

  res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
});

// 📜 Get wishlist items
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist')
    .select('wishlist');

  res.json(user.wishlist);
});
