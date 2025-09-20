import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BACKEND_URL } from './config'; // adjust path if inside components folder

const API_BASE_URL = `${BACKEND_URL}/api`;

const HiddenJobsPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchHiddenJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/careers/hidden`);
        setJobs(res.data.hidden_opportunities);
      } catch (error) {
        console.error('Failed to fetch hidden jobs:', error);
      }
    };
    fetchHiddenJobs();
  }, []);

  return (
    <div>
      <h1>Hidden Job Opportunities</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Discover high-paying, future-proof roles you might not know about.</p>
      
      <div className="card">
        <h2>Emerging Roles in India</h2>
        {jobs.map(job => (
          <div key={job.id} style={{ backgroundColor: '#1a2434', borderRadius: '8px', padding: '16px', marginBottom: '12px', border: '1px solid #334155' }}>
            <h4 style={{ fontSize: '18px', color: '#60a5fa' }}>{job.title}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              <div>
                <p style={{ margin: '0' }}>**Avg Salary:** ₹{job.avgSalaryLPA} LPA</p>
                <p style={{ margin: '0' }}>**Growth:** {job.growth}</p>
              </div>
              <div>
                <p style={{ margin: '0' }}>**Companies:** {job.company}</p>
                <p style={{ margin: '0' }}>**Why It's Hidden:** {job.whyUnknown}</p>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0', color: '#cbd5e1' }}>Example Job Titles:</p>
              <ul style={{ color: '#94a3b8', fontSize: '14px', paddingLeft: '20px', margin: '0' }}>
                {job.jobs.map((j, i) => <li key={i}>{j}</li>)}
              </ul>
              <p style={{ fontWeight: 'bold', margin: '10px 0 0' }}>Internships:</p>
              <ul style={{ color: '#94a3b8', fontSize: '14px', paddingLeft: '20px', margin: '0' }}>
                {job.internships.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiddenJobsPage;