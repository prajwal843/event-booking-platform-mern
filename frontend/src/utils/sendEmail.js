// const nodemailer = require("nodemailer");

// const sendEmail = async (email, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER, // your gmail
//       pass: process.env.EMAIL_PASS  // app password
//     }
//   });

//   await transporter.sendMail({
//     from: `"Event Booking" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;
