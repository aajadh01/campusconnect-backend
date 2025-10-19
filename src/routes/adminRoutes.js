// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  deleteUser,
  changeUserPassword,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// all admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/password', changeUserPassword);

module.exports = router;
