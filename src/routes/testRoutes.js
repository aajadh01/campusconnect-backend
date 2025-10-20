const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/private', protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.fullName}, you accessed a protected route!`,
    role: req.user.role,
  });
});

// Example of a route only Admin can access
router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    message: `Welcome Admin ${req.user.fullName}!`,
  });
});

module.exports = router;
