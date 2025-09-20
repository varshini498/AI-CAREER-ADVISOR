import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;
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

  const readinessScore = readiness ? readiness.readiness : 0;
  const topCareer = readiness ? readiness.title : 'N/A';
  const dashOffset = 440 - (440 * readinessScore) / 100;

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Welcome back, {user.name.split(' ')[0]}! Your personalized insights are ready.</p>
      
      <div className="dashboard-header-card">
        <div className="readiness-section-new">
          <div className="readiness-circle">
            <svg className="readiness-svg">
              <circle className="readiness-bg" cx="80" cy="80" r="70"></circle>
              <circle
                className="readiness-progress"
                cx="80"
                cy="80"
                r="70"
                style={{ strokeDashoffset: dashOffset }}
              ></circle>
            </svg>
            <div className="readiness-score-new">
              {readinessScore}%
            </div>
          </div>
          <div className="readiness-details">
            <h2 className="readiness-details-title">Job Readiness Index</h2>
            <p className="readiness-details-label">
              Your top matching career is: **{topCareer}**
            </p>
          </div>
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