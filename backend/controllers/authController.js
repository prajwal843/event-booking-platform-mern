// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '7d',
//   });
// };

// // @route   POST /api/auth/register
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const user = await User.create({ name, email, password });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





const User = require('../models/User');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
// const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
// const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// const generateEmailToken = (id) =>
//   jwt.sign({ id }, process.env.EMAIL_SECRET, { expiresIn: '1d' });

// @route   POST /api/auth/register


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: '1d' });

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    const verifyLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await sendEmail(
      email,
      'Verify Your Email',
      `<p>Hello ${name},</p>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const user = await User.create({ name, email, password });

//  const emailToken = generateEmailToken(user._id);
// const url = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

// res.status(201).json({
//   _id: user._id,
//   name: user.name,
//   email: user.email,
//   isAdmin: user.isAdmin,
//   token: generateToken(user._id),
// });


// // await sendEmail(
// //   user.email,
// //   'Verify your email',
// //   `<h3>Hello ${user.name},</h3>
// //    <p>Please verify your email by clicking the link below:</p>
// //    <a href="${url}">${url}</a>`
// // );

// // res.status(201).json({ message: 'Registered! Please verify your email.' });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// @route   POST /api/auth/login


// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     if (!user.isVerified) {
//       return res.status(401).json({ message: 'Please verify your email before logging in.' });
//     }

//     const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // if (!user.isVerified) {
    //   return res.status(401).json({ message: 'Please verify your email' });
    // }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send('<h2>Email verified successfully! You can now log in.</h2>');
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(400).json({ message: 'Invalid token' });

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid or expired token' });
//   }
// };




// // const jwt = require("jsonwebtoken");
// const sendEmail = require("../utils/sendEmail");

// // after user.save()
// const emailToken = jwt.sign({ id: user._id }, process.env.JWT_EMAIL_SECRET, {
//   expiresIn: "1d"
// });

// const url = `${process.env.BASE_URL}/verify-email/${emailToken}`;

// await sendEmail(
//   user.email,
//   "Verify your email",
//   `<h3>Hi ${user.name},</h3><p>Please verify your email by clicking this link: <a href="${url}">${url}</a></p>`
// );


// // @route   POST /api/auth/login
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
