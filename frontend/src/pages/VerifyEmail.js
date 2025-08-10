import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
