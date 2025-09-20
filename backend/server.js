const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const bcrypt = require('bcrypt');
const ShortUUID = require('short-uuid');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// init lowdb
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= {
    users: [],
    careers: [{
      "id": "data_scientist", "title": "Data Scientist", "skills": ["Python", "Statistics", "Machine Learning", "SQL"], "avgSalaryLPA": 12, "growth": "High", "description": "Extract insights from data, build predictive models, and deploy solutions to solve business problems."
    }, {
      "id": "ai_engineer", "title": "AI Engineer", "skills": ["Deep Learning", "TensorFlow", "PyTorch", "Python", "NLP"], "avgSalaryLPA": 15, "growth": "High", "description": "Design, build, and maintain AI models and systems. Focus on algorithms and computational efficiency."
    }, {
      "id": "full_stack_developer", "title": "Full Stack Developer", "skills": ["React", "Node.js", "MongoDB", "Express", "REST API"], "avgSalaryLPA": 9, "growth": "High", "description": "Develop and manage both frontend and backend of web applications. Expertise in the MERN stack is in high demand."
    }, {
      "id": "devops_engineer", "title": "DevOps Engineer", "skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Git"], "avgSalaryLPA": 11, "growth": "High", "description": "Bridge the gap between development and operations. Focus on automating and optimizing the software delivery process."
    }, {
      "id": "cyber_security_analyst", "title": "Cyber Security Analyst", "skills": ["Network Security", "Penetration Testing", "Cryptography", "Ethical Hacking"], "avgSalaryLPA": 10, "growth": "High", "description": "Protect an organization's computer systems and networks from threats. Monitor for security breaches and respond to attacks."
    }, {
      "id": "game_developer", "title": "Game Developer", "skills": ["C++", "Unity", "Game Design", "3D Modeling"], "avgSalaryLPA": 7, "growth": "Medium", "description": "Design and code video games, from concept to final product. Work on graphics, gameplay, and user interface."
    }],
    hidden_opportunities: [{
      "id": "space_tech_engineer", "title": "Space Tech Engineer", "avgSalaryLPA": 15, "growth": "High", "whyUnknown": "Niche startups and ISRO programs", "company": "Agnikul, Skyroot", "jobs": ["Propulsion Engineer", "Satellite Design Specialist"], "internships": ["ISRO Internships", "Agnikul Summer Intern"]
    }, {
      "id": "ev_battery_specialist", "title": "EV Battery Specialist", "avgSalaryLPA": 8, "growth": "High", "whyUnknown": "New industry, specialized demand", "company": "Ola Electric, Tata Motors", "jobs": ["Battery Engineer", "BMS Software Developer"], "internships": ["Ola Electric Intern", "Tata Motors Trainee"]
    }, {
      "id": "ethical_ai_governance_officer", "title": "Ethical AI Governance Officer", "avgSalaryLPA": 16, "growth": "High", "whyUnknown": "Emerging role in tech policy", "company": "Google, Microsoft", "jobs": ["AI Policy Analyst", "Ethical AI Architect"], "internships": ["Google AI Intern", "Microsoft Responsible AI"]
    }, {
      "id": "climate_data_scientist", "title": "Climate Data Scientist", "avgSalaryLPA": 13, "growth": "High", "whyUnknown": "Emerging in renewable energy sector", "company": "ReNew Power, Adani Green", "jobs": ["Climate Risk Analyst", "Renewable Energy Modeler"], "internships": ["ReNew Power Trainee"]
    }, {
      "id": "fintech_security_architect", "title": "Fintech Security Architect", "avgSalaryLPA": 18, "growth": "High", "whyUnknown": "High demand in India’s payments sector", "company": "Paytm, PhonePe", "jobs": ["UPI Security Architect", "Payment Gateway Analyst"], "internships": ["Paytm Security Intern"]
    }, {
      "id": "urban_farming_specialist", "title": "Urban Farming Specialist", "avgSalaryLPA": 6, "growth": "Medium", "whyUnknown": "Growing demand for sustainable food systems", "company": "Agri-Tech Startups", "jobs": ["Vertical Farm Manager", "Hydroponics Consultant"], "internships": ["Local Greenhouses"]
    }, {
      "id": "biomedical_data_scientist", "title": "Biomedical Data Scientist", "avgSalaryLPA": 14, "growth": "High", "whyUnknown": "Intersection of healthcare and tech", "company": "Cipla, Dr. Reddy's Lab", "jobs": ["Clinical Data Analyst", "Genomics Researcher"], "internships": ["Pharma R&D"]
    }, {
      "id": "blockchain_developer", "title": "Blockchain Developer", "avgSalaryLPA": 18, "growth": "High", "whyUnknown": "New and specialized fintech roles", "company": "Coinbase, Binance", "jobs": ["Smart Contract Developer", "dApp Engineer"], "internships": ["Crypto Startups"]
    }],
    mentors: [{
      "id": "mentor_1", "name": "Anita Rao", "expertise": ["Data Science", "Machine Learning"], "location": "Bengaluru", "bio": "Ex-Amazon ML Engineer.", "email": "anita@example.com"
    }, {
      "id": "mentor_2", "name": "Ravi Kumar", "expertise": ["Full Stack Development", "DevOps"], "location": "Pune", "bio": "Senior Engineer at a major tech company.", "email": "ravi@example.com"
    }, {
      "id": "mentor_3", "name": "Priya Sharma", "expertise": ["Cyber Security", "Network Security"], "location": "Delhi", "bio": "Lead Security Analyst at a fintech firm.", "email": "priya@example.com"
    }, {
      "id": "mentor_4", "name": "Karthik Reddy", "expertise": ["Space Tech", "Aerospace Engineering"], "location": "Hyderabad", "bio": "Founder of a space tech startup.", "email": "karthik@example.com"
    }, {
      "id": "mentor_5", "name": "Sneha Gupta", "expertise": ["Biomedical Engineering", "Data Science"], "location": "Mumbai", "bio": "Senior Data Scientist in the healthcare sector.", "email": "sneha@example.com"
    }],
    feedback: [],
    mentor_contacts: []
  };
  await db.write();
}
initDB();

app.use((req, res, next) => {
  req.db = db;
  next();
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const db = req.db;
  const { name, email, password } = req.body;
  await db.read();
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: 'user_' + ShortUUID.generate(), name, email, password: hashedPassword, skills: [], projects: [], courses: [], college: '', lastUpdated: new Date().toISOString()
  };
  db.data.users.push(user);
  await db.write();
  res.json({ user });
});

app.post('/api/auth/login', async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user });
});

// --- PROFILE ROUTES ---
app.put('/api/profile/:userId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, {
    skills: req.body.skills || [], projects: req.body.projects || [], college: req.body.college || '', interests: req.body.interests || [], courses: req.body.courses || [], lastUpdated: new Date().toISOString()
  });
  try {
    await db.write();
    res.json({ user });
  } catch (err) {
    console.error('Failed to write to DB:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/profile/:userId/resume', upload.single('resume'), async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const parsedSkills = ["Python", "Machine Learning", "Data Analysis", "SQL", "React"];
  const parsedProjects = ["E-commerce App", "Data Visualization Project"];
  const parsedCourses = ["Intro to Python", "Web Development Bootcamp"];
  
  Object.assign(user, {
    skills: [...new Set([...(user.skills || []), ...parsedSkills])],
    projects: [...new Set([...(user.projects || []), ...parsedProjects])],
    courses: [...new Set([...(user.courses || []), ...parsedCourses])]
  });
  
  await db.write();
  res.json({ user, message: "Resume uploaded and profile updated." });
});

app.get('/api/profile/:userId/readiness', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { careers } = db.data;
  const scored = careers.map(c => {
    const match = c.skills.filter(s => (user.skills || []).includes(s)).length;
    const readiness = Math.round((match / Math.max(1, c.skills.length)) * 100);
    return { careerId: c.id, title: c.title, readiness };
  }).sort((a, b) => b.readiness - a.readiness);
  res.json({ scored, best: scored[0] });
});

// --- CAREER ROUTES ---
app.get('/api/careers/recommendations/:userId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const userSkills = user.skills || [];
  const recommendedCareers = db.data.careers.map(career => {
    const skillMatch = career.skills.filter(skill => userSkills.includes(skill)).length;
    return { ...career, matchScore: skillMatch };
  }).sort((a, b) => b.matchScore - a.matchScore);
  res.json({ careers: recommendedCareers });
});

app.get('/api/careers/hidden', async (req, res) => {
  const db = req.db;
  await db.read();
  res.json({ hidden_opportunities: db.data.hidden_opportunities });
});

// New route for Skill Gap Analysis
app.get('/api/ai/skill-gap/:userId/:careerId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  const career = db.data.careers.find(c => c.id === req.params.careerId);

  if (!user || !career) {
    return res.status(404).json({ error: 'User or career not found' });
  }

  const userSkills = new Set(user.skills || []);
  
  const presentSkills = career.skills.filter(skill => userSkills.has(skill));
  const missingSkills = career.skills.filter(skill => !userSkills.has(skill));
  
  res.json({
    careerTitle: career.title,
    presentSkills,
    missingSkills
  });
});

// --- MENTOR ROUTES ---
app.post('/api/mentor/match', async (req, res) => {
  const db = req.db;
  const { userId } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const matches = db.data.mentors.map(m => {
    const overlap = m.expertise.filter(e => (user.skills || []).includes(e)).length;
    return { mentor: m, score: overlap };
  }).sort((a, b) => b.score - a.score);
  const top = matches.slice(0, 3).map(m => ({ mentor: m.mentor, draftQuestions: [] }));
  res.json({ matches: top });
});

app.post('/api/mentor/contact', async (req, res) => {
  const db = req.db;
  const { userId, mentorId } = req.body;
  await db.read();
  
  const user = db.data.users.find(u => u.id === userId);
  const mentor = db.data.mentors.find(m => m.id === mentorId);
  
  if (!user || !mentor) {
    return res.status(404).json({ error: 'User or mentor not found' });
  }

  const contactRequest = {
    id: `contact_${ShortUUID.generate()}`,
    userId: user.id,
    mentorId: mentor.id,
    userName: user.name,
    mentorName: mentor.name,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.data.mentor_contacts.push(contactRequest);
  await db.write();
  
  res.json({ message: 'Contact request sent successfully.' });
});

// --- AI INTERVIEW COACH ROUTES ---
const interviewQuestions = {
  'data_scientist': "Tell me about a time you used data to solve a problem. What was the outcome?",
  'ai_engineer': "Describe a machine learning model you built. What challenges did you face?",
  'full_stack_developer': "Explain a RESTful API you've built. How did you handle data validation?",
};

const interviewFeedback = {
  'data_scientist': "Good answer! You clearly explained the problem and solution. Try to add more detail on the specific libraries or algorithms you used next time.",
  'ai_engineer': "Excellent! You provided good technical depth. For future questions, also mention how you might optimize the model for production.",
  'full_stack_developer': "Solid response. You covered the core concepts. To improve, discuss how you would scale the API to handle more users."
};

app.get('/api/ai/interview-coach/question/:careerId', (req, res) => {
  const { careerId } = req.params;
  const question = interviewQuestions[careerId] || "Tell me about yourself.";
  res.json({ question });
});

app.post('/api/ai/interview-coach/feedback/:careerId', (req, res) => {
  const { careerId } = req.params;
  const { answer } = req.body;
  const feedback = interviewFeedback[careerId] || "Thank you for your answer. You can improve by providing more specific details.";
  res.json({ feedback });
});


// --- AI ROADMAP ROUTES ---
app.post('/api/ai/roadmap', async (req, res) => {
  const { careerId, userId } = req.body;
  const db = req.db;
  await db.read();
  const career = db.data.careers.find(c => c.id === careerId);
  const user = db.data.users.find(u => u.id === userId);
  if (!career) return res.status(404).json({ error: 'career not found' });
  const roadmap = {
    title: `${career.title} — 6-month Starter Roadmap`,
    summary: `Personalized for ${user.name}.`,
    steps: [
      { month: 1, title: `Foundations: Learn ${career.skills[0]}`, tasks: [`Complete a beginner course on NPTEL/Coursera.`, `Set up a GitHub profile and make your first commit.`] },
      { month: 2, title: `Intermediate: Deepen skills`, tasks: [`Work on a mini-project.`, `Contribute to a relevant open-source project.`] },
      { month: 4, title: `Applied: Build a capstone project`, tasks: [`Integrate 2-3 skills into a single project.`, `Document your project and deploy it.`]},
      { month: 6, title: `Certs & Hiring Prep`, tasks: [`Complete a recognized certification.`, `Prepare a portfolio and refine your resume.`] }
    ],
    courses: [{ name: `Intro to ${career.skills[0]}`, type: 'online', link: 'https://nptel.ac.in' }],
    youtube: [{ name: 'A day in the life of a ' + career.title, link: 'https://youtube.com/watch?v=xyz' }],
    jobs: [{ title: `Junior ${career.title} at Infosys`, salary: '₹8-10 LPA' }],
    internships: [{ company: 'Google', role: `${career.title} Intern` }]
  };
  res.json({ roadmap });
});

// --- FEEDBACK ROUTE ---
app.post('/api/feedback', async (req, res) => {
  const db = req.db;
  const { userId, text } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const feedbackEntry = {
    id: `feedback_${ShortUUID.generate()}`,
    userId,
    userName: user.name,
    text,
    createdAt: new Date().toISOString()
  };
  
  db.data.feedback.push(feedbackEntry);
  await db.write();
  res.json({ message: 'Feedback submitted successfully.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));