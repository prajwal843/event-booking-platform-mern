const Booking = require('../models/Booking');
const Event = require('../models/Event');

const sendEmail = require('../utils/sendEmail');
const { bookingConfirmationTemplate } = require('../utils/emailTemplates');
// const bookingConfirmationTemplate = require('../templates/bookingConfirmation');

// await sendEmail(
//   user.email,
//   '🎟️ Booking Confirmation - EventBooking',
//   bookingConfirmationTemplate(user.name, event, seats)
// );

// POST /api/bookings

exports.bookSeats = async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.bookedSeats + seats > event.totalSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    event.bookedSeats += seats;
    await event.save();

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      seats,
      bookingDate: new Date(),
    });

    // Send booking confirmation email
    await sendEmail(
      req.user.email,
      '🎟 Booking Confirmation',
      bookingConfirmationTemplate(req.user.name, event, seats)
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  const { eventId, seats } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.bookedSeats + seats > event.totalSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      seats,
    });

    event.bookedSeats += seats;
    await event.save();


//     await sendEmail(
//   req.user.email, // recipient's email
//   '🎟 Booking Confirmation',
//   `
//     <h2>Booking Confirmed!</h2>
//     <p>Hi ${req.user.name},</p>
//     <p>Your booking for <strong>${event.name}</strong> is confirmed.</p>
//     <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
//     <p>Venue: ${event.venue}</p>
//     <p>Seats Booked: ${seats}</p>
//     <p>Thank you for booking with us!</p>
//   `
// );

    res.status(201).json(booking);


     (async () => {
      try {
        await sendEmail(
          req.user.email,
          '🎟 Booking Confirmation',
          `
            <h2>Booking Confirmed!</h2>
            <p>Hi ${req.user.name},</p>
            <p>Your booking for <strong>${event.name}</strong> is confirmed.</p>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Venue: ${event.venue}</p>
            <p>Seats Booked: ${seats}</p>
            <p>Thank you for booking with us!</p>
          `
        );
      } catch (err) {
        console.error('Error sending booking confirmation email:', err);
      }
    })();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/my
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
