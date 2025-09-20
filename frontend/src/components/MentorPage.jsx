import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const MentorPage = ({ user }) => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/mentor/match`, { userId: user.id });
        setMentors(res.data.matches);
      } catch (error) {
        console.error('Failed to fetch mentors:', error);
      }
    };
    fetchMentors();
  }, [user]);

  return (
    <div>
      <h1>AI Mentor Match</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Find mentors based on your profile and get AI-drafted questions for your call.</p>
      
      <div className="card">
        <h2>Top Matches for You</h2>
        {mentors.length > 0 ? (
          mentors.map((match) => (
            <div key={match.mentor.id} style={{ backgroundColor: '#1a2434', borderRadius: '8px', padding: '16px', marginBottom: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>{match.mentor.name}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>Expertise: {match.mentor.expertise.join(', ')}</p>
                <p style={{ fontSize: '14px', color: '#94a3b18' }}>Email: {match.mentor.email}</p>
              </div>
              <button style={{ backgroundColor: '#6366f1', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Message Mentor</button>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8' }}>No mentors found yet.</p>
        )}
      </div>
    </div>
  );
};

export default MentorPage;