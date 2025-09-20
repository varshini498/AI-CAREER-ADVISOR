import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BACKEND_URL } from './config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const MentorPage = ({ user }) => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/mentor/match`, { userId: user.id });
        setMentors(res.data.matches);
      } catch (error) {
        console.error('Failed to fetch mentors:', error);
      }
    };
    if (user && user.skills && user.skills.length > 0) {
      fetchMentors();
    } else {
      setMentors([]);
    }
  }, [user]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert('Please type a message before sending.');
      return;
    }
    const subject = `Question for ${selectedMentor.name} from AI Career Advisor`;
    const body = `Hi ${selectedMentor.name},\n\n${message}\n\nBest regards,\n${user.name}`;
    window.location.href = `mailto:${selectedMentor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    alert('Email sent successfully!');
    setSelectedMentor(null);
    setMessage('');
  };

  const handleContactMe = () => {
    alert('Your contact request has been sent to the mentor successfully!');
    setSelectedMentor(null);
  };

  return (
    <div>
      <h1>AI Mentor Match</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Find mentors based on your profile and get in touch directly.</p>
      
      {user && user.skills && user.skills.length > 0 ? (
        <div className="card">
          <h2>Top Matches for You</h2>
          {mentors.length > 0 ? (
            mentors.map((match) => (
              <div key={match.mentor.id} className="mentor-card-list">
                <div className="mentor-card-content">
                  <h3 className="mentor-name">{match.mentor.name}</h3>
                  <p className="mentor-expertise">Expertise: {match.mentor.expertise.join(', ')}</p>
                  <p className="mentor-bio">{match.mentor.bio}</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setSelectedMentor(match.mentor)}
                >
                  Message Mentor
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>No mentors found yet for your skills.</p>
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Please update your profile with your skills to find a mentor.</p>
        </div>
      )}

      {selectedMentor && (
        <div className="mentor-modal-overlay">
          <div className="mentor-modal-content card">
            <h3>Message {selectedMentor.name}</h3>
            <p style={{marginBottom: '20px'}}>Type your message to send an email, or choose another option.</p>
            <div className="form-group">
              <textarea
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <div className="modal-actions">
              <button onClick={handleSendMessage} className="btn-primary">
                Send Email
              </button>
              <button onClick={handleContactMe} className="btn-secondary">
                Contact Me
              </button>
              <button onClick={() => setSelectedMentor(null)} className="btn-close">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorPage;