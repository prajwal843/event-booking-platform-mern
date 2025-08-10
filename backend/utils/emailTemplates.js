// backend/utils/emailTemplates.js

const bookingConfirmationTemplate = (userName, event, seats) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    h2 { color: #007bff; }
    .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
    .footer { font-size: 12px; color: #777; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>🎟 Booking Confirmation</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Your booking for <strong>${event.name}</strong> is confirmed.</p>
    <div class="details">
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Seats:</strong> ${seats}</p>
    </div>
    <p>Thank you for booking with <strong>EventBooking</strong>!</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} EventBooking. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const eventUpdateTemplate = (userName, eventName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    h2 { color: #ffc107; }
    .footer { font-size: 12px; color: #777; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>📢 Event Update</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>The event <strong>${eventName}</strong> has been updated. Please check the event details for the latest information.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} EventBooking. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const eventCancellationTemplate = (userName, eventName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; background: #fff; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    h2 { color: #dc3545; }
    .footer { font-size: 12px; color: #777; margin-top: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>❌ Event Cancelled</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>We regret to inform you that the event <strong>${eventName}</strong> has been cancelled. Your booking will be refunded soon.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} EventBooking. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  bookingConfirmationTemplate,
  eventUpdateTemplate,
  eventCancellationTemplate
};
