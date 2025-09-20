import React from 'react';

const FAQPage = () => {
  const faqs = [
    { question: 'How do I get personalized career recommendations?', answer: 'Update your profile with your skills, projects, and interests. The system will then analyze this information to give you tailored recommendations.' },
    { question: 'What is a Career Digital Twin?', answer: 'It is a dynamic profile that tracks your academic and professional progress, including your skills, projects, and certifications. It helps you monitor your readiness for various career paths.' },
    { question: 'How are mentors matched?', answer: 'Mentors are matched based on the skills you have listed in your profile. The system finds professionals with overlapping expertise to ensure the guidance is relevant.' },
    { question: 'Why am I only seeing one or two jobs?', answer: 'The application filters and ranks jobs based on your skills. As you add more skills and complete projects, more relevant jobs and internships will become visible.' },
    { question: 'How does the roadmap work?', answer: 'The roadmap provides a step-by-step learning plan for a chosen career path, including courses, projects, and milestones you should achieve month-by-month.' },
  ];

  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <p style={{ color: '#a3a3a3', marginBottom: '30px' }}>Find answers to the most common questions about the platform.</p>
      
      <div className="card">
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#60a5fa', marginBottom: '8px' }}>{faq.question}</h3>
            <p style={{ color: '#e0e7ff', lineHeight: '1.6' }}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;