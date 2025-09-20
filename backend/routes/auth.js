const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ShortUUID = require('short-uuid');

router.post('/register', async (req, res) => {
  const db = req.db;
  const { name, email, password } = req.body;
  await db.read();
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: 'user_' + ShortUUID.generate(),
    name,
    email,
    password: hashedPassword,
    skills: [],
    courses: [],
    projects: [],
    lastUpdated: new Date().toISOString()
  };
  db.data.users.push(user);
  await db.write();
  res.json({ user });
});

router.post('/login', async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
  res.json({ user });
});

module.exports = router;