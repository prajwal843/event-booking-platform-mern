import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user || user.isAdmin) {
  navigate('/');
  return;
}

    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  return (
  <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
    <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>🎟️ My Bookings</h2>

    {bookings.length === 0 ? (
  <p style={{ textAlign: 'center', color: '#777' }}>You have no bookings.</p>
) : (
  bookings.map((booking) => (
    <div
      key={booking._id}
      className="booking-card"
      style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '16px',
        borderLeft: '5px solid #007bff',
      }}
    >
      {booking.event ? (
        <>
          <h4 style={{ margin: '0 0 10px', color: '#007bff' }}>{booking.event.name}</h4>
          <p><strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString()}</p>
          <p><strong>Venue:</strong> {booking.event.venue}</p>
        </>
      ) : (
        <>
          <h4 style={{ margin: '0 0 10px', color: 'red' }}>Event Deleted</h4>
          <p style={{ color: '#777' }}>This event was removed by the admin after your booking.</p>
        </>
      )}
      
      <p><strong>Seats Booked:</strong> {booking.seats}</p>
      <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
    </div>
  ))
)}

  </div>
);

};

export default Dashboard;
