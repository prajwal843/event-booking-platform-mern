import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);


  const getBookedSeats = () => {
  // If event.bookedSeats is a number (like 5), convert it to array [1, 2, 3, 4, 5]
  const count = Number(event.bookedSeats) || 0;
  const booked = [];
  for (let i = 1; i <= count; i++) {
    booked.push(i);
  }
  return booked;
};

  const generateSeats = () => {
  const total = event.totalSeats;
  const booked = getBookedSeats();
  const rows = 5;
  const cols = Math.ceil(total / rows);
  const seats = [];

  let seatNum = 1;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (seatNum <= total) {
        const isBooked = booked.includes(seatNum);
        row.push({ number: seatNum, booked: isBooked });
        seatNum++;
      }
    }
    seats.push(row);
  }

  return seats;
};

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.isAdmin) {
  // Prevent admin from booking
  return;
}

    try {
      await axios.post(
  'http://localhost:5000/api/bookings',
  { eventId: event._id, seats: selectedSeats.length, seatNumbers: selectedSeats },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('✅ Booking successful!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setMessage('');
    }
  };


  const toggleSeat = (number) => {
  setSelectedSeats(prev =>
    prev.includes(number)
      ? prev.filter(n => n !== number)
      : [...prev, number]
  );
};


  if (!event) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  const availableSeats = event.totalSeats - event.bookedSeats;

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '25px',
    maxWidth: '600px',
    margin: '30px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    lineHeight: '1.6',
  };

  const titleStyle = {
    marginTop: 0,
    color: '#007bff',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '10px',
  };

  const bookingSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  };

  const inputStyle = {
    width: '80px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const successStyle = {
    color: 'green',
    marginTop: '15px',
  };

  const errorStyle = {
    color: 'red',
    marginTop: '15px',
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{event.name}</h2>
      <p><span style={labelStyle}>Date:</span> {new Date(event.date).toLocaleDateString()}</p>
      <p><span style={labelStyle}>Time:</span> {event.time}</p>
      <p><span style={labelStyle}>Venue:</span> {event.venue}</p>
      <p><span style={labelStyle}>Category:</span> {event.category}</p>
      <p><span style={labelStyle}>Price:</span> ₹{event.price}</p>
      <p><span style={labelStyle}>Available Seats:</span> {availableSeats}</p>

      
{!user?.isAdmin && (
  <>
    <h4 style={{ marginTop: '30px' }}>Select your seats:</h4>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px', marginTop: '10px' }}>
      {generateSeats().flat().map(seat => (
        <button
          key={seat.number}
          disabled={seat.booked}
          onClick={() => toggleSeat(seat.number)}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: seat.booked
              ? '#ccc'
              : selectedSeats.includes(seat.number)
              ? '#007bff'
              : '#f9f9f9',
            color: seat.booked ? '#666' : selectedSeats.includes(seat.number) ? '#fff' : '#000',
            cursor: seat.booked ? 'not-allowed' : 'pointer',
          }}
        >
          {seat.number}
        </button>
      ))}
    </div>

    <p style={{ marginTop: '15px' }}>
      Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
    </p>

    {selectedSeats.length > 0 && (
      <button onClick={handleBooking} style={{ ...buttonStyle, marginTop: '10px' }}>
        Book Now
      </button>
    )}
  </>
)}


      {message && <p style={successStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default EventDetails;
