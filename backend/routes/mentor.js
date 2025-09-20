const express = require('express');
const router = express.Router();

router.post('/match', async (req, res) => {
  const db = req.db;
  const { userId } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const matches = db.data.mentors.map(m => {
    const overlap = m.expertise.filter(e => (user.skills || []).includes(e)).length;
    return { mentor: m, score: overlap };
  }).sort((a, b) => b.score - a.score);

  const top = matches.slice(0, 3).map(m => {
    return {
      mentor: m.mentor,
      draftQuestions: [
        `Hi ${m.mentor.name}, I’m ${user.name}. How did you transition into ${m.mentor.expertise[0]}?`,
        `What projects should I do to get a junior role in ${m.mentor.expertise[0]}?`,
        `Which certifications helped you most?`
      ]
    };
  });

  res.json({ matches: top });
});

module.exports = router;