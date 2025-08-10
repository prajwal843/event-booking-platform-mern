import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
  });

  const fetchEvents = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/events?${query}`);
      setEvents(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchEvents();
  };

  // ✅ Inline styles
  const containerStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '30px',
  };

  const filterBox = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '25px',
    justifyContent: 'center',
  };

  const inputStyle = {
    padding: '8px',
    minWidth: '160px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const eventGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const cardTitle = {
    color: '#007bff',
    marginBottom: '10px',
  };

  const linkStyle = {
    marginTop: '10px',
    color: '#007bff',
    fontWeight: 'bold',
    textDecoration: 'none',
    alignSelf: 'flex-start',
  };


  const clearFilters = () => {
  setFilters({
    date: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
  });
  fetchEvents(); // Reload events without filters
};
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🎉 Upcoming Events</h2>

      {/* Filters */}
      {/* Modern Filters */}
<div
  style={{
    ...filterBox,
    background: '#f1f5f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '40px',
  }}
>
  {/* Each filter group with label */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '4px', fontWeight: '500' }}>Date</label>
    <input type="date" name="date" onChange={handleChange} style={inputStyle} />
  </div>

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '4px', fontWeight: '500' }}>Category</label>
    <input type="text" name="category" placeholder="e.g. Music" onChange={handleChange} style={inputStyle} />
  </div>

  {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '4px', fontWeight: '500' }}>Location</label>
    <input type="text" name="location" placeholder="e.g. Mumbai" onChange={handleChange} style={inputStyle} />
  </div> */}

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '4px', fontWeight: '500' }}>Min Price</label>
    <input type="number" name="priceMin" placeholder="₹0" onChange={handleChange} style={inputStyle} />
  </div>

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ marginBottom: '4px', fontWeight: '500' }}>Max Price</label>
    <input type="number" name="priceMax" placeholder="₹1000" onChange={handleChange} style={inputStyle} />
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '10px' }}>
  <button onClick={handleFilter} style={{ ...buttonStyle, marginTop: '24px' }}>Apply Filters</button>
  <button
    onClick={clearFilters}
    style={{
      ...buttonStyle,
      backgroundColor: '#6c757d', // Gray
    }}
  >
    Clear Filters
  </button>
</div>

</div>


      {/* Events */}
      <div style={eventGrid}>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No events found.</p>
        ) : (
          events.map(event => (
            <div key={event._id} style={cardStyle}>
              <h3 style={cardTitle}>{event.name}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Price:</strong> ₹{event.price}</p>
              <p><strong>Available Seats:</strong> {event.totalSeats - event.bookedSeats}</p>
              <Link to={`/event/${event._id}`} style={linkStyle}>View Details →</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
