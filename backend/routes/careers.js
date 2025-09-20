const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.db;
  await db.read();
  res.json({ careers: db.data.careers });
});

router.get('/recommendations/:userId', async (req, res) => {
  const db = req.db;
  await db.read();
  const user = db.data.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const userSkills = user.skills || [];
  const recommendedCareers = db.data.careers.map(career => {
    const skillMatch = career.skills.filter(skill => userSkills.includes(skill)).length;
    return { ...career, matchScore: skillMatch };
  }).sort((a, b) => b.matchScore - a.matchScore); // No slice, so all are returned

  res.json({ careers: recommendedCareers });
});

router.get('/hidden', async (req, res) => {
  const db = req.db;
  await db.read();
  res.json({ hidden_opportunities: db.data.hidden_opportunities });
});

module.exports = router;