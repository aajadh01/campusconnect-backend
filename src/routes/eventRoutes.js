// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
  createEvent,
  getAllEvents,
  registerEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create', upload.single('image'), createEvent);
router.get('/', getAllEvents);
router.put('/:id/register', registerEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
