// src/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { isValidRegisteredIdForRole } = require('../utils/validators');

// ✅ Create new user (by Admin)
exports.createUser = asyncHandler(async (req, res) => {
  const { registeredId, fullName, password, role } = req.body;

  if (!registeredId || !fullName || !password || !role) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (!isValidRegisteredIdForRole(role, registeredId)) {
    res.status(400);
    throw new Error('registeredId format invalid for role');
  }

  const existingUser = await User.findOne({ registeredId });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this registeredId already exists');
  }

  const user = await User.create({
    registeredId,
    fullName,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: `User ${user.fullName} (${user.role}) created successfully`,
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
