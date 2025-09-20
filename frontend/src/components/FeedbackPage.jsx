import React, { useState } from 'react';
import axios from 'axios';

import { BACKEND_URL } from '../config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const FeedbackPage = ({ user }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = async () => {
    if (feedback.trim() === '') {
      alert('Feedback cannot be empty.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/feedback`, { userId: user.id, text: feedback });
      alert('Thank you for your feedback! It has been submitted.');
      setFeedback('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div>
      <h1>Feedback</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>We value your input. Please share your thoughts to help us improve.</p>
      
      <div className="card">
        <h2>Submit Your Feedback</h2>
        <div className="form-group">
          <label>Your Feedback</label>
          <textarea
            rows="5"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #334155', backgroundColor: '#1a2434', color: 'white', borderRadius: '8px' }}
          />
        </div>
        <button onClick={handleSubmitFeedback} className="btn-primary">Submit Feedback</button>
      </div>
    </div>
  );
};

export default FeedbackPage;