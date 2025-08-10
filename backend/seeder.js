const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => console.error(err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
      isVerified: true
    });

    const regularUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
    });

    const events = await Event.insertMany([
      {
        name: 'Music Concert',
        date: new Date('2025-09-01'),
        time: '18:00',
        venue: 'City Hall',
        category: 'Music',
        totalSeats: 100,
        bookedSeats: 10,
        price: 499,
      },
      {
        name: 'Tech Conference',
        date: new Date('2025-09-15'),
        time: '09:00',
        venue: 'Tech Park',
        category: 'Technology',
        totalSeats: 200,
        bookedSeats: 20,
        price: 999,
      }
    ]);

    await Booking.create({
      user: regularUser._id,
      event: events[0]._id,
      seats: 2,
    });

    console.log('✅ Data Seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
