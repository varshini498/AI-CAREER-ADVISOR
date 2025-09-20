const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/:userId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.put('/:userId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  Object.assign(user, {
    skills: req.body.skills || [],
    courses: req.body.courses || [],
    projects: req.body.projects || [],
    college: req.body.college || '',
    interests: req.body.interests || [],
    lastUpdated: new Date().toISOString()
  });

  try {
    await db.write();
    res.json({ user });
  } catch (err) {
    console.error('Failed to write to DB:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:userId/resume', upload.single('resume'), async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Acknowledge the file upload without processing it
  res.json({
    user,
    message: "Resume uploaded successfully. Please manually add the details."
  });
});

router.get('/:userId/readiness', async (req, res) => {
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

module.exports = router;