import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  const buttonStyle = {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  };


  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px' }}>📝 Register</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
