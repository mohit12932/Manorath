const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, eventValidation } = require('../middleware/validation.middleware');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('organizer', 'admin'), validate(eventValidation), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
