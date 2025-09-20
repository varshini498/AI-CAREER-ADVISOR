import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BACKEND_URL } from './config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const InterviewCoachModal = ({ career, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/ai/interview-coach/question/${career.id}`);
        setQuestion(res.data.question);
        setShowFeedback(false);
      } catch (error) {
        console.error('Failed to fetch question:', error);
        setQuestion("Failed to load question. Please try again.");
      }
    };
    fetchQuestion();
  }, [career]);

  const getFeedback = async () => {
    if (answer.trim() === '') {
      alert("Please provide an answer first.");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/interview-coach/feedback/${career.id}`, { answer });
      setFeedback(res.data.feedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to get feedback:', error);
      setFeedback("Failed to get feedback. Please try again.");
      setShowFeedback(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="interview-coach-modal card">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>AI Interview Coach for {career.title}</h2>
        <div className="question-box">
          <p className="question-text">{question}</p>
        </div>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <textarea
            placeholder="Type your answer here..."
            rows="6"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button className="btn-primary" onClick={getFeedback}>
            Get Feedback
          </button>
        </div>
        {showFeedback && (
          <div className="feedback-box">
            <h4 style={{ color: '#60a5fa', marginBottom: '10px' }}>AI Feedback:</h4>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCoachModal;