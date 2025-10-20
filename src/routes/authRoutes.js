// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

const { protect } = require('../middleware/auth');
const { changePassword } = require('../controllers/authController');

router.put('/change-password', protect, changePassword);

module.exports = router;
