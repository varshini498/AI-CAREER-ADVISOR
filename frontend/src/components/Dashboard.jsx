import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const Dashboard = ({ user }) => {
  const [readiness, setReadiness] = useState(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/${user.id}/readiness`);
        setReadiness(res.data.best);
      } catch (error) {
        console.error("Failed to fetch readiness data:", error);
      }
    };
    fetchReadiness();
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Welcome back, {user.name.split(' ')[0]}! Your personalized insights are ready.</p>
      
      <div className="dashboard-header-card">
        <div className="readiness-section">
          <h2>Job Readiness Index</h2>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${readiness ? readiness.readiness : 0}%` }}></div>
          </div>
          <p className="readiness-score">
            {readiness ? `${readiness.readiness}% Ready` : 'Calculating...'}
          </p>
          <p className="readiness-label">
            Your top matching career is: **{readiness ? readiness.title : 'N/A'}**
          </p>
        </div>
      </div>
      
      <div className="dashboard-twin-card">
        <h2>Your Career Digital Twin</h2>
        <div className="dashboard-grid">
          <div className="dashboard-stat">
            <div className="dashboard-stat-value">{user.skills.length}</div>
            <div className="dashboard-stat-label">Skills</div>
          </div>
          <div className="dashboard-stat">
            <div className="dashboard-stat-value">{user.projects.length}</div>
            <div className="dashboard-stat-label">Projects</div>
          </div>
          <div className="dashboard-stat">
            <div className="dashboard-stat-value">{user.courses.length}</div>
            <div className="dashboard-stat-label">Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;