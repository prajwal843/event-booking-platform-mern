// const Event = require('../models/Event');

// // const sendEmail = require('../utils/sendEmail');

// // GET /api/events
// exports.getAllEvents = async (req, res) => {
//   try {
//     const { date, category, location, priceMin, priceMax } = req.query;

//     let query = {};

//     if (date) query.date = { $gte: new Date(date) };
//     if (category) query.category = category;
//     if (location) query.venue = { $regex: location, $options: 'i' };
//     if (priceMin || priceMax) {
//       query.price = {};
//       if (priceMin) query.price.$gte = parseFloat(priceMin);
//       if (priceMax) query.price.$lte = parseFloat(priceMax);
//     }

//     const events = await Event.find(query);
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /api/events/:id
// exports.getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
//     res.json(event);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // POST /api/admin/events
// exports.createEvent = async (req, res) => {
//   try {
//     const newEvent = await Event.create(req.body);
//     res.status(201).json(newEvent);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // PUT /api/admin/events/:id
// exports.updateEvent = async (req, res) => {
//   try {
//     const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Event not found' });
//     // const bookings = await Booking.find({ event: id }).populate('user');

//     // for (const booking of bookings) {
//     //   await sendEmail(
//     //     booking.user.email,
//     //     '📢 Event Update Notification',
//     //     `<p>Dear ${booking.user.name},</p>
//     //      <p>The event <strong>${updatedEvent.name}</strong> has been <strong>updated</strong>.</p>`
//     //   );
//     // }
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE /api/admin/events/:id
// exports.deleteEvent = async (req, res) => {
//   try {
//     const deleted = await Event.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Event not found' });
//     res.json({ message: 'Event deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




const Event = require('../models/Event');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

// GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const { date, category, location, priceMin, priceMax } = req.query;

    let query = {};

    if (date) query.date = { $gte: new Date(date) };
    if (category) query.category = category;
    if (location) query.venue = { $regex: location, $options: 'i' };
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/events
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    Object.assign(event, req.body);
    await event.save();

    // 📧 Send notification to all booked users
    // const bookings = await Booking.find({ event: event._id }).populate('user');
    // for (const booking of bookings) {
    //   await sendEmail(
    //     booking.user.email,
    //     '📢 Event Update Notification',
    //     `<p>Dear ${booking.user.name},</p>
    //      <p>The event <strong>${event.name}</strong> has been updated.</p>
    //      <p>New Date: ${new Date(event.date).toLocaleDateString()}</p>
    //      <p>Venue: ${event.venue}</p>`
    //   );
    // }

    res.json(event);
    (async () => {
  const bookings = await Booking.find({ event: event._id }).populate('user');
  await Promise.all(bookings.map(booking =>
    sendEmail(
      booking.user.email,
      '📢 Event Update Notification',
      `<p>Dear ${booking.user.name},</p>
       <p>The event <strong>${event.name}</strong> has been updated.</p>
       <p>New Date: ${new Date(event.date).toLocaleDateString()}</p>
       <p>Venue: ${event.venue}</p>`
    )
  ));
})();
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 📧 Send cancellation email before deleting
    // const bookings = await Booking.find({ event: event._id }).populate('user');
    // for (const booking of bookings) {
    //   await sendEmail(
    //     booking.user.email,
    //     '❌ Event Cancellation Notice',
    //     `<p>Dear ${booking.user.name},</p>
    //      <p>We regret to inform you that the event <strong>${event.name}</strong> has been cancelled.</p>
    //      <p>You will be contacted soon regarding any refunds or rescheduling.</p>`
    //   );
    // }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });

    (async () => {
      try {
        const bookings = await Booking.find({ event: event._id }).populate('user');
        await Promise.all(bookings.map(booking =>
          sendEmail(
            booking.user.email,
            '❌ Event Cancellation',
            `<p>Dear ${booking.user.name},</p>
             <p>We regret to inform you that the event <strong>${event.name}</strong> has been cancelled.</p>
             <p>You will be contacted soon regarding any refunds or rescheduling.</p>`
          )
        ));
      } catch (err) {
        console.error('Error sending cancellation emails:', err);
      }
    })();
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: err.message });
  }
};
