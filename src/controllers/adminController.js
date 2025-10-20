// src/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ✅ Create new user (by Admin)
exports.createUser = asyncHandler(async (req, res) => {
  const { regNumber, fullName, password, role } = req.body;

  if (!regNumber || !fullName || !password || !role) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ regNumber });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this regNumber already exists');
  }

  const user = await User.create({
    regNumber,
    fullName,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: `User ${user.fullName} (${user.role}) created successfully`,
    user: {
      id: user._id,
      regNumber: user.regNumber,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

// ✅ Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ count: users.length, users });
});

// ✅ Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

// ✅ Change user password
exports.changeUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) {
    res.status(400);
    throw new Error('New password required');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

// ✅ Toggle user ban status
exports.toggleUserBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.banned = !user.banned;
  await user.save();

  res.json({
    message: `User ${user.banned ? 'banned' : 'unbanned'} successfully`,
    banned: user.banned
  });
});
