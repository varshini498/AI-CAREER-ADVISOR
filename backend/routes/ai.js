const express = require('express');
const router = express.Router();
const googleAI = require('../services/googleAI');

router.post('/roadmap', async (req,res) => {
  const db = req.db;
  const { careerId, userId } = req.body;
  await db.read();
  const career = db.data.careers.find(c => c.id === careerId);
  const user = db.data.users.find(u => u.id === userId);
  if(!career) return res.status(404).json({error:'career not found'});
  
  try {
    const roadmap = await googleAI.generateRoadmap({ career, user });
    res.json({ roadmap });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'AI generation failed' });
  }
});

module.exports = router;