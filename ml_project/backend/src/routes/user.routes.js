const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getMyEvents,
  getRegisteredEvents
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.get('/my-events', protect, getMyEvents);
router.get('/registered-events', protect, getRegisteredEvents);

module.exports = router;
