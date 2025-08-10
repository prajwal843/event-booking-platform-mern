const express = require('express');
const { admin, protect } = require('../middleware/auth');
const {
  getAllBookings,
  getAllUsers,
  getBookingAnalytics
} = require('../controllers/adminController');
const {
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

const { getUserBookings } = require('../controllers/adminController');

// Event Management
router.post('/events', protect, admin, createEvent);
router.put('/events/:id', protect, admin, updateEvent);
router.delete('/events/:id', protect, admin, deleteEvent);

// Booking & User Management
router.get('/bookings', protect, admin, getAllBookings);
router.get('/users', protect, admin, getAllUsers);
router.get('/analytics', protect, admin, getBookingAnalytics);
router.get('/user/:userId/bookings', protect, admin, getUserBookings);

module.exports = router;
