🎟 Event Booking Platform
A MERN stack application for managing events, bookings, and users with admin panel, email notifications, email verification, and Docker support.

📌 Features
User Features
Register/Login with email verification

Browse and filter events by date, category, location, and price

Book seats for events (live seat count update planned)

Receive booking confirmation emails

Receive notifications for event updates or cancellations

Admin Features
Manage events (Create, Update, Delete)

Manage users and view their booking history

Set seat limits per event

Send notifications on event changes

Tech Stack
Frontend: React.js

Backend: Node.js + Express.js

Database: MongoDB (Atlas or local)

Email Service: Nodemailer (Gmail SMTP)

Containerization: Docker + Docker Compose

🛠 Prerequisites
Before running the project, make sure you have:

Node.js v18.x or higher (Backend & Frontend)

MongoDB (Local or Atlas)

Docker & Docker Compose installed

Gmail account with App Password enabled for email sending

⚙ Environment Variables
Create a .env file in the backend folder with:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SECRET=your_email_verification_secret
SMTP_USER=your_gmail_email
SMTP_PASS=your_gmail_app_password

🚀 Setup Instructions
1️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/event-booking-platform.git
cd event-booking-platform

2️⃣ Install dependencies
Backend
bash
Copy
Edit
cd backend
npm install
Frontend
bash
Copy
Edit
cd ../frontend
npm install
🐳 Running with Docker

1️⃣ Build and run containers
bash
Copy
Edit
docker-compose up --build

2️⃣ Seed the database (Admin, sample events, sample users)
bash
Copy
Edit
docker exec -it <backend_container_name> sh
node seeder.js

🖥 Running Locally (Without Docker)
Backend
bash
Copy
Edit
cd backend
npm run dev
Frontend
bash
Copy
Edit
cd frontend
npm start

📧 Email Notifications
The system sends:

Booking confirmation

Event update notifications

Event cancellation notifications

Email verification link

🔮 Upcoming Features
Real-time seat updates using Socket.io

Advanced analytics for admins
