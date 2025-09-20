import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Your AI Career Path Awaits</h1>
        <p className="welcome-tagline">
          Unlock your potential with personalized guidance for the evolving job market.
        </p>
        <Link to="/login">
          <button className="welcome-btn">
            Get Started
            <i className="fas fa-arrow-right" style={{marginLeft: '10px'}}></i>
          </button>
        </Link>
      </div>
      <div className="welcome-visual">
        <div className="cube-1"></div>
        <div className="cube-2"></div>
        <div className="cube-3"></div>
      </div>
    </div>
  );
};

export default WelcomePage;