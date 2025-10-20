// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  deleteUser,
  changeUserPassword,
  toggleUserBan,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// TEMPORARY: Setup route for creating first admin user (remove after initial setup)
router.post('/setup', async (req, res) => {
  try {
    const { regNumber, fullName, password } = req.body;
    if (!regNumber || !fullName || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const User = require('../models/User');
    const existingUser = await User.findOne({ regNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      regNumber,
      fullName,
      password,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        regNumber: user.regNumber,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// all admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/password', changeUserPassword);
router.put('/users/:id/ban', toggleUserBan);

module.exports = router;
