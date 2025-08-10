import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData, close }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    totalSeats: '',
    price: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date?.split('T')[0] || '',
      });
    }
  }, [initialData]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  // ✅ Inline styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonRow = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  };

  const submitBtn = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const cancelBtn = {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    padding: '10px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '4px',
    color: '#333',
  };

  return (
  <form onSubmit={handleSubmit} style={formStyle}>
    {[
      { label: 'Event Name', name: 'name', type: 'text', placeholder: 'Event Name' },
      { label: 'Date', name: 'date', type: 'date' },
      { label: 'Time', name: 'time', type: 'time' },
      { label: 'Venue', name: 'venue', type: 'text', placeholder: 'Venue' },
      { label: 'Category', name: 'category', type: 'text', placeholder: 'Category' },
      { label: 'Total Seats', name: 'totalSeats', type: 'number', placeholder: 'Total Seats' },
      { label: 'Price (₹)', name: 'price', type: 'number', placeholder: 'Price' },
    ].map(({ label, name, type, placeholder }) => (
      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor={name} style={{ width: '120px', fontWeight: 'bold', fontSize: '14px' }}>
          {label}:
        </label>
        <input
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required
          style={inputStyle}
        />
      </div>
    ))}

    <div style={buttonRow}>
      <button type="button" onClick={close} style={cancelBtn}>
        Cancel
      </button>
      <button type="submit" style={submitBtn}>
        {initialData ? 'Update' : 'Create'} Event
      </button>
    </div>
  </form>
);

};

export default EventForm;
