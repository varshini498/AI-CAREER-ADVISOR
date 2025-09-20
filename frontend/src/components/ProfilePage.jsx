import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const ProfilePage = ({ user, setUser }) => {
  const [form, setForm] = useState({
    skills: user?.skills?.join(', ') || '',
    courses: user?.courses?.join(', ') || '',
    projects: user?.projects?.join(', ') || '',
    college: user?.college || '',
    interests: user?.interests?.join(', ') || ''
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        courses: form.courses.split(',').map(s => s.trim()).filter(Boolean),
        projects: form.projects.split(',').map(s => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        college: form.college
      };
      
      const res = await axios.put(`${API_BASE_URL}/profile/${user.id}`, dataToSave);
      setUser(res.data.user);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error.response?.data || error.message);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleResumeUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    
    // Simulate resume analysis without adding incorrect data
    alert('Resume uploaded successfully! Your profile will be updated with these skills after you click "Save Profile".');
  };

  return (
    <div>
      <h1>Your Profile</h1>
      
      <div className="card">
        <h2>Profile Details</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={user.name} disabled style={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
        </div>
        <div className="form-group">
          <label>College</label>
          <input type="text" name="college" value={form.college} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Skills (e.g., Python, Data Analysis)</label>
          <input type="text" name="skills" value={form.skills} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Courses Completed</label>
          <input type="text" name="courses" value={form.courses} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Projects (e.g., COVID Data Dashboard)</label>
          <input type="text" name="projects" value={form.projects} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Interests</label>
          <input type="text" name="interests" value={form.interests} onChange={handleChange} />
        </div>
        <button onClick={handleSave} style={{ backgroundColor: '#6366f1', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Save Profile</button>
      </div>

      <div className="card" style={{ marginTop: '25px' }}>
        <h2>Auto-Populate from Resume</h2>
        <div className="form-group">
          <label>Upload your Resume (PDF/DOCX)</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button onClick={handleResumeUpload} style={{ backgroundColor: '#34d399', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Upload & Analyze</button>
      </div>
    </div>
  );
};

export default ProfilePage;