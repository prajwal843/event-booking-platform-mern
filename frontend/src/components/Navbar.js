import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navStyle = {
    backgroundColor: '#50C878',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const linkGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '6px 10px',
    borderRadius: '4px',
    transition: 'background 0.3s',
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={{ ...linkStyle, fontSize: '18px' }}>🎟️ EventBooking</Link>
      </div>

      <div style={linkGroupStyle}>
        {user && (
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            👤 {user.name}
          </span>
        )}

        {!user && (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}

        {user && (
          <>
            {user && !user.isAdmin && (
  <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
)}
{user?.isAdmin && (
  <Link to="/admin" style={linkStyle}>Admin Panel</Link>
)}

            {user.isAdmin && <Link to="/admin" style={linkStyle}>Admin</Link>}
            <button
              onClick={logout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
