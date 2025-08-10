const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');


const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

// router.get('/verify-email/:token', verifyEmail);

module.exports = router;



// router.get("/verify-email/:token", async (req, res) => {
//   try {
//     const decoded = jwt.verify(req.params.token, process.env.JWT_EMAIL_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.isVerified)
//       return res.status(400).json({ message: "Email already verified" });

//     user.isVerified = true;
//     await user.save();

//     res.status(200).send("Email verified successfully. You can now login.");
//   } catch (err) {
//     res.status(400).send("Invalid or expired token.");
//   }
// });



