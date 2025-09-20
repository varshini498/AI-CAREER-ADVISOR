// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const bcrypt = require('bcryptjs');
const ShortUUID = require('short-uuid');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- TEST ROUTE ---
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend is running!' });
});

// --- LOWDB SETUP ---
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= {
    users: [],
    careers: [],
    hidden_opportunities: [],
    mentors: [],
    feedback: [],
    mentor_contacts: [],
    project_ideas: {}
  };
  await db.write();
}
initDB();

// --- ATTACH DB ---
app.use((req, res, next) => {
  req.db = db;
  next();
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await db.read();
    if (db.data.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: 'user_' + ShortUUID.generate(),
      name,
      email,
      password: hashedPassword,
      skills: [],
      projects: [],
      courses: [],
      college: '',
      lastUpdated: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PROFILE ROUTES ---
app.put('/api/profile/:userId', async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    Object.assign(user, {
      skills: req.body.skills || [],
      projects: req.body.projects || [],
      college: req.body.college || '',
      interests: req.body.interests || [],
      courses: req.body.courses || [],
      lastUpdated: new Date().toISOString()
    });
    await db.write();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- RESUME UPLOAD ---
app.post('/api/profile/:userId/resume', upload.single('resume'), async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Simulated parsing
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
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- CAREER ROUTES ---
app.get('/api/careers/recommendations/:userId', async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const recommendedCareers = db.data.careers.map(career => {
      const matchScore = career.skills.filter(skill => user.skills.includes(skill)).length;
      return { ...career, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
    res.json({ careers: recommendedCareers });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/careers/hidden', async (req, res) => {
  try {
    await db.read();
    res.json({ hidden_opportunities: db.data.hidden_opportunities });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/projects/ideas', async (req, res) => {
  try {
    await db.read();
    res.json({ project_ideas: db.data.project_ideas });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- AI SKILL GAP ---
app.get('/api/ai/skill-gap/:userId/:careerId', async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.userId);
    const career = db.data.careers.find(c => c.id === req.params.careerId);
    if (!user || !career) return res.status(404).json({ error: 'User or career not found' });

    const userSkills = new Set(user.skills || []);
    const presentSkills = career.skills.filter(skill => userSkills.has(skill));
    const missingSkills = career.skills.filter(skill => !userSkills.has(skill));

    res.json({ careerTitle: career.title, presentSkills, missingSkills });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- MENTOR ROUTES ---
app.post('/api/mentor/match', async (req, res) => {
  try {
    const { userId } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const matches = db.data.mentors.map(m => ({
      mentor: m,
      score: m.expertise.filter(e => user.skills.includes(e)).length
    })).sort((a, b) => b.score - a.score);
    const top = matches.slice(0, 3).map(m => ({ mentor: m.mentor, draftQuestions: [] }));
    res.json({ matches: top });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/mentor/contact', async (req, res) => {
  try {
    const { userId, mentorId } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.id === userId);
    const mentor = db.data.mentors.find(m => m.id === mentorId);
    if (!user || !mentor) return res.status(404).json({ error: 'User or mentor not found' });

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
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- AI INTERVIEW COACH ---
const interviewQuestions = {
  'data_scientist': "Tell me about a time you used data to solve a problem.",
  'ai_engineer': "Describe a machine learning model you built.",
  'full_stack_developer': "Explain a RESTful API you've built."
};

const interviewFeedback = {
  'data_scientist': "Good answer! Add more detail on libraries/algorithms.",
  'ai_engineer': "Excellent! Mention optimization for production next time.",
  'full_stack_developer': "Solid. Discuss scaling API for more users."
};

app.get('/api/ai/interview-coach/question/:careerId', (req, res) => {
  const { careerId } = req.params;
  const question = interviewQuestions[careerId] || "Tell me about yourself.";
  res.json({ question });
});

app.post('/api/ai/interview-coach/feedback/:careerId', (req, res) => {
  const { careerId } = req.params;
  const { answer } = req.body;
  const feedback = interviewFeedback[careerId] || "Thank you for your answer. Provide more specific details next time.";
  res.json({ feedback });
});

// --- AI ROADMAP ---
app.post('/api/ai/roadmap', async (req, res) => {
  try {
    const { careerId, userId } = req.body;
    await db.read();
    const career = db.data.careers.find(c => c.id === careerId);
    const user = db.data.users.find(u => u.id === userId);
    if (!career) return res.status(404).json({ error: 'Career not found' });

    const roadmap = {
      title: `${career.title} — 6-month Starter Roadmap`,
      summary: `Personalized for ${user ? user.name : 'user'}.`,
      steps: [
        { month: 1, title: `Foundations: Learn ${career.skills[0]}`, tasks: ["Complete beginner course.", "Setup GitHub profile."] },
        { month: 2, title: "Intermediate: Deepen skills", tasks: ["Work on mini-project.", "Contribute to open-source."] },
        { month: 4, title: "Applied: Build capstone project", tasks: ["Integrate skills into a project.", "Document and deploy."] },
        { month: 6, title: "Certs & Hiring Prep", tasks: ["Complete certification.", "Refine resume and portfolio."] }
      ]
    };
    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- FEEDBACK ---
app.post('/api/feedback', async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
