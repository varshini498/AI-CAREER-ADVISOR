import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import { BACKEND_URL } from './config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please check your email and password.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#f8fafc', marginBottom: '20px' }}>Login to Your Profile</h2>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a3a3a3' }}>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1a2434', color: 'white', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a3a3a3' }}>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1a2434', color: 'white', fontSize: '16px' }}
          />
        </div>
        <button onClick={handleLogin} style={{ backgroundColor: '#6366f1', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s' }}>Login</button>
        <p style={{ marginTop: '15px', color: '#a3a3a3', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'none' }}>Register here.</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;