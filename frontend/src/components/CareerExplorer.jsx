import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const CareerExplorer = ({ user }) => {
  const [careers, setCareers] = useState([]);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/careers/recommendations/${user.id}`);
        setCareers(res.data.careers);
      } catch (error) {
        console.error('Failed to fetch careers:', error);
      }
    };
    fetchCareers();
  }, [user]);

  const generateRoadmap = async (careerId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/roadmap`, { careerId, userId: user.id });
      setRoadmap(res.data.roadmap);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      alert('Failed to generate roadmap. Please check backend.');
    }
  };

  return (
    <div>
      <h1>Career Explorer</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Discover personalized career paths based on your skills and interests.</p>
      
      <div className="card">
        <h2>Recommended Roles</h2>
        {careers.map(career => (
          <div key={career.id} style={{ backgroundColor: '#1a2434', borderRadius: '8px', padding: '16px', marginBottom: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>{career.title}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>Skills: {career.skills.join(', ')}</p>
            </div>
            <button style={{ backgroundColor: '#6366f1', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} onClick={() => generateRoadmap(career.id)}>
              Get Roadmap
            </button>
          </div>
        ))}
      </div>
      
      {roadmap && (
        <div className="card" style={{ marginTop: '25px' }}>
          <h2>{roadmap.title}</h2>
          <p style={{ color: '#a3a3a3' }}>{roadmap.summary}</p>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>Learning Roadmap</h3>
            <div className="roadmap-flowchart">
              {roadmap.steps.map((step, index) => (
                <div key={index} className="roadmap-step">
                  <div className="roadmap-month">Month {step.month}</div>
                  <div className="roadmap-content">
                    <h4 className="roadmap-title">{step.title}</h4>
                    <ul className="roadmap-tasks">
                      {step.tasks.map((task, i) => (
                        <li key={i}><i className="fas fa-check-circle"></i>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#f8fafc', marginBottom: '10px', marginTop: '20px' }}>Recommended Resources</h3>
            <div className="resource-grid">
              <div>
                <h4 style={{ color: '#60a5fa' }}>Courses & Certifications</h4>
                <ul className="resource-list">
                  {roadmap.courses && roadmap.courses.map((c, i) => (
                    <li key={i}><i className="fas fa-book-reader"></i><a href={c.link} target="_blank" rel="noopener noreferrer">{c.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#60a5fa' }}>YouTube Videos</h4>
                <ul className="resource-list">
                  {roadmap.youtube && roadmap.youtube.map((y, i) => (
                    <li key={i}><i className="fab fa-youtube"></i><a href={y.link} target="_blank" rel="noopener noreferrer">{y.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 style={{ color: '#f8fafc', marginBottom: '10px', marginTop: '20px' }}>Job & Internship Opportunities</h3>
            <div className="job-opportunity-grid">
              <div>
                <h4 style={{ color: '#60a5fa' }}>Jobs</h4>
                <ul className="opportunity-list">
                  {roadmap.jobs && roadmap.jobs.map((job, i) => (
                    <li key={i}>
                      <p className="opportunity-title">{job.title}</p>
                      <p className="opportunity-salary">Salary: {job.salary}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#60a5fa' }}>Internships</h4>
                <ul className="opportunity-list">
                  {roadmap.internships && roadmap.internships.map((intern, i) => (
                    <li key={i}>
                      <p className="opportunity-title">{intern.company}: {intern.role}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerExplorer;