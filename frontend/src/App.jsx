import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import CareerExplorer from './components/CareerExplorer';
import MentorPage from './components/MentorPage';
import HiddenJobsPage from './components/HiddenJobsPage';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import FAQPage from './components/FAQPage';
import FeedbackPage from './components/FeedbackPage';

const App = () => {
  const [user, setUser] = useState(null);
  
  // Modified handleLogout function to add error handling
  const handleLogout = () => {
    try {
      setUser(null);
      alert('Logout successful!');
    } catch (error) {
      alert('Logout failed!');
    }
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="/careers" element={<CareerExplorer user={user} />} />
            <Route path="/mentors" element={<MentorPage user={user} />} />
            <Route path="/hidden-jobs" element={<HiddenJobsPage user={user} />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/feedback" element={<FeedbackPage user={user} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav className="sidebar">
      <div className="logo">AI Career Advisor</div>
      <div className="nav-links">
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
          <li><Link to="/profile"><i className="fas fa-user-circle"></i> Profile</Link></li>
          <li><Link to="/careers"><i className="fas fa-briefcase"></i> Career Explorer</Link></li>
          <li><Link to="/mentors"><i className="fas fa-chalkboard-teacher"></i> Mentors</Link></li>
          <li><Link to="/hidden-jobs"><i className="fas fa-search-plus"></i> Hidden Jobs</Link></li>
          <li className="separator"></li>
          <li><Link to="/faq"><i className="fas fa-question-circle"></i> FAQ</Link></li>
          <li><Link to="/feedback"><i className="fas fa-comment-dots"></i> Feedback</Link></li>
        </ul>
      </div>
      <div className="profile-section-container" ref={dropdownRef}>
        <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <div className="profile-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
          <i className="fas fa-caret-down" style={{marginLeft: 'auto'}}></i>
        </div>
        {showDropdown && (
          <div className="profile-dropdown">
            <button onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
              <i className="fas fa-user-circle"></i>Your Profile
            </button>
            <button onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default App;