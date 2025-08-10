const Booking = require('../models/Booking');
const User = require('../models/User');
const Event = require('../models/Event');

// GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user event');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings' });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/analytics
exports.getBookingAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: '$event',
          totalBookings: { $sum: '$seats' },
          count: { $sum: 1 }
        }
      }
    ]);
    const result = await Event.populate(bookings, { path: '_id' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
