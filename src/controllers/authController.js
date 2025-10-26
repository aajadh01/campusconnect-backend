// src/controllers/authController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidRegisteredIdForRole } = require('../utils/validators');

// helper to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { registeredId, password } = req.body;

  if (!registeredId || !password) {
    res.status(400);
    throw new Error('Please enter both registeredId and password');
  }

  const user = await User.findOne({ registeredId });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Validate registeredId format against the stored user role
  if (!isValidRegisteredIdForRole(user.role, registeredId)) {
    res.status(400);
    throw new Error('registeredId format invalid for role');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      registeredId: user.registeredId,
      role: user.role,
    },
  });
});

// ⚙️ Change Password for logged-in user
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Both current and new passwords are required');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});
