import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import { BACKEND_URL } from '../config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Email might already be in use.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#f8fafc', marginBottom: '20px' }}>Create an Account</h2>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#a3a3a3' }}>Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1a2434', color: 'white', fontSize: '16px' }}
          />
        </div>
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
        <button onClick={handleRegister} style={{ backgroundColor: '#6366f1', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s' }}>Register</button>
        <p style={{ marginTop: '15px', color: '#a3a3a3', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>Login here.</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;