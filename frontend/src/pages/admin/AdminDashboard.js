import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../../components/admin/EventForm';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null);
const [selectedUserName, setSelectedUserName] = useState('');
const [selectedUserBookings, setSelectedUserBookings] = useState([]);
const [showBookingModal, setShowBookingModal] = useState(false);


  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user]);

  

const fetchUserBookings = async (userId, name) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/admin/user/${userId}/bookings`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setSelectedUserBookings(res.data);
    setSelectedUserId(userId);
    setSelectedUserName(name);
    setShowBookingModal(true);
  } catch (err) {
    console.error(err);
    setSelectedUserBookings([]);
  }
};




  const fetchData = async () => {
    try {
      const token = user.token;
      const headers = { Authorization: `Bearer ${token}` };

      const [eventRes, userRes, bookRes, analyticsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events'),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/bookings', { headers }),
        axios.get('http://localhost:5000/api/admin/analytics', { headers }),
      ]);

      setEvents(eventRes.data);
      setUsers(userRes.data);
      setBookings(bookRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '1000px',
    margin: '30px auto',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '30px',
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px',
  };

  const tabButtonStyle = (active) => ({
    padding: '10px 18px',
    backgroundColor: active ? '#007bff' : '#f0f0f0',
    color: active ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  });

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '18px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  };

  const actionButtonStyle = {
    padding: '8px 14px',
    borderRadius: '5px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const deleteBtn = {
    ...actionButtonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  const editBtn = {
    ...actionButtonStyle,
    backgroundColor: '#ffc107',
    color: '#000',
  };

  const createBtn = {
    ...actionButtonStyle,
    backgroundColor: '#28a745',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>⚙️ Admin Dashboard</h2>

      {/* Tabs */}
      <div style={tabsStyle}>
        <button onClick={() => setTab('events')} style={tabButtonStyle(tab === 'events')}>Events</button>
        <button onClick={() => setTab('users')} style={tabButtonStyle(tab === 'users')}>Users</button>
        <button onClick={() => setTab('bookings')} style={tabButtonStyle(tab === 'bookings')}>Bookings</button>
        <button onClick={() => setTab('analytics')} style={tabButtonStyle(tab === 'analytics')}>Analytics</button>
      </div>

      {/* Content */}
      <div>
        {tab === 'events' && (
          <>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                onClick={() => { setShowForm(true); setEditEvent(null); }}
                style={createBtn}
              >
                + Create New Event
              </button>
            </div>

            {events.map((event) => (
              <div key={event._id} style={cardStyle}>
                <h4 style={{ color: '#007bff' }}>{event.name}</h4>
                <p>{new Date(event.date).toLocaleDateString()} - {event.venue}</p>
                <p>Seats Booked: {event.bookedSeats}/{event.totalSeats}</p>
                <div style={buttonGroupStyle}>
                  <button onClick={() => setEditEvent(event) || setShowForm(true)} style={editBtn}>Edit</button>
                  <button onClick={() => handleDeleteEvent(event._id)} style={deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'users' && (
  <>
    <h3 style={{ color: '#007bff', marginBottom: '20px' }}>👤 All Users</h3>
    {users.map((u) => (
      <div key={u._id} style={{ ...cardStyle, backgroundColor: selectedUserId === u._id ? '#e9f7ff' : '#fff' }}>
        <p><strong>{u.name}</strong> ({u.email})</p>
        <button
  onClick={() => fetchUserBookings(u._id, u.name)}
  style={{
    marginTop: '10px',
    padding: '6px 12px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  }}
>
  View Bookings
</button>

      </div>
    ))}

    {/* Show user bookings */}
    {selectedUserId && (
      <div style={{ marginTop: '30px' }}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: '#007bff' }}>📄 Booking History</h4>
          <button
            onClick={() => {
              setSelectedUserId(null);
              setSelectedUserBookings([]);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc3545',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ❌ Close
          </button>
        </div> */}

        {showBookingModal && (
  <>
    {/* Overlay */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      }}
      onClick={() => setShowBookingModal(false)}
    />

    {/* Modal */}
    <div
  style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '25px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',         // 👈 restrict height
    overflowY: 'auto',         // 👈 enable scroll inside modal
    zIndex: 1000,
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  }}
>

      <h3 style={{ color: '#007bff' }}>📄 {selectedUserName}'s Booking History</h3>
      <button
        onClick={() => setShowBookingModal(false)}
        style={{
          position: 'absolute',
          top: '15px',
          right: '20px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          color: '#999',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>

      {selectedUserBookings.length === 0 ? (
        <p style={{ color: '#777' }}>No bookings found for this user.</p>
      ) : (
        selectedUserBookings.map((b) => (
          <div key={b._id} style={{ ...cardStyle, marginTop: '15px' }}>
            <p><strong>Event:</strong> {b.event?.name || 'Event deleted'}</p>
            <p><strong>Seats:</strong> {b.seats}</p>
            <p><strong>Date:</strong> {new Date(b.bookingDate).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  </>
)}

      </div>
    )}
  </>
)}




        {tab === 'bookings' && (
  <>
    <h3>All Bookings</h3>
    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      bookings.map((b) => (
        <div key={b._id} style={cardStyle}>
          <p><strong>User:</strong> {b.user ? b.user.name : 'User Deleted'}</p>
          <p><strong>Event:</strong> {b.event ? b.event.name : 'Event Deleted'}</p>
          <p><strong>Seats:</strong> {b.seats}</p>
        </div>
      ))
    )}
  </>
)}

        {tab === 'analytics' && (
  <>
    <h3>Booking Analytics</h3>
    {analytics.length === 0 ? (
      <p>No analytics data available.</p>
    ) : (
      analytics.map((a) => (
        a._id ? ( // Check if event still exists
          <div key={a._id._id} style={cardStyle}>
            <p><strong>Event:</strong> {a._id.name}</p>
            <p><strong>Total Seats Booked:</strong> {a.totalBookings}</p>
            <p><strong>Bookings Count:</strong> {a.count}</p>
          </div>
        ) : (
          <div key={Math.random()} style={{ ...cardStyle, backgroundColor: '#f8d7da', color: '#721c24' }}>
            <p><strong>Event Deleted</strong></p>
            <p>This record refers to an event that no longer exists.</p>
          </div>
        )
      ))
    )}
  </>
)}


        {showForm && (
  <>
    {/* Backdrop Overlay */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
      }}
      onClick={() => setShowForm(false)} // Click outside to close
    />

    {/* Modal Form Container */}
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '30px 25px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '500px',
        zIndex: 1001,
      }}
    >
      {/* Close Button */}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={() => setShowForm(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999',
          }}
        >
          &times;
        </button>
      </div>

      <EventForm
        initialData={editEvent}
        close={() => setShowForm(false)}
        onSubmit={async (formData) => {
          try {
            const token = user.token;
            if (editEvent) {
              await axios.put(
                `http://localhost:5000/api/admin/events/${editEvent._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } else {
              await axios.post(
                'http://localhost:5000/api/admin/events',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
            setShowForm(false);
            fetchData();
          } catch (err) {
            console.error('Form error:', err);
          }
        }}
      />
    </div>
  </>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
