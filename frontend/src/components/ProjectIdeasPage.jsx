import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const ProjectIdeasPage = () => {
  const [ideas, setIdeas] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('beginner');

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects/ideas`);
        setIdeas(res.data.project_ideas);
      } catch (error) {
        console.error("Failed to fetch project ideas:", error);
      }
    };
    fetchIdeas();
  }, []);

  const renderRoadmap = (roadmap) => (
    <ul className="roadmap-list">
      {Object.entries(roadmap).map(([key, value]) => (
        <li key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1>Project Ideas</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Explore a curated list of projects to build your portfolio and impress recruiters.</p>

      {ideas && (
        <div className="project-ideas-container">
          <div className="project-ideas-tabs">
            <button className={activeTab === 'beginner' ? 'tab-active' : ''} onClick={() => { setActiveTab('beginner'); setSelectedProject(null); }}>Beginner</button>
            <button className={activeTab === 'intermediate' ? 'tab-active' : ''} onClick={() => { setActiveTab('intermediate'); setSelectedProject(null); }}>Intermediate</button>
            <button className={activeTab === 'advanced' ? 'tab-active' : ''} onClick={() => { setActiveTab('advanced'); setSelectedProject(null); }}>Advanced</button>
          </div>
          
          <div className="project-content">
            <div className="project-list">
              {activeTab === 'beginner' && ideas.beginner.map(project => (
                <div key={project.id} className={`project-card ${selectedProject?.id === project.id ? 'card-active' : ''}`} onClick={() => setSelectedProject(project)}>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
              ))}
              {activeTab === 'intermediate' && ideas.intermediate.map(project => (
                <div key={project.id} className={`project-card ${selectedProject?.id === project.id ? 'card-active' : ''}`} onClick={() => setSelectedProject(project)}>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
              ))}
              {activeTab === 'advanced' && ideas.advanced.map(project => (
                <div key={project.id} className={`project-card ${selectedProject?.id === project.id ? 'card-active' : ''}`} onClick={() => setSelectedProject(project)}>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
              ))}
            </div>
            {selectedProject && (
              <div className="project-details-card card">
                <h2 className="project-details-title">{selectedProject.title}</h2>
                <p className="project-details-description">{selectedProject.description}</p>
                
                <h3 className="project-details-section-title">Roadmap</h3>
                {selectedProject.roadmap ? renderRoadmap(selectedProject.roadmap) : <p>Roadmap not available for this project.</p>}
                
                <h3 className="project-details-section-title">Skills Applied</h3>
                <ul className="skills-list">
                  {selectedProject.skills.map((skill, index) => <li key={index}><span className="skill-tag">{skill}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectIdeasPage;