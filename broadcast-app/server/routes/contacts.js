const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Saare 6 contacts fetch karo (slot ke hisaab se sorted)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ slot: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Contacts fetch nahi ho paaye', details: err.message });
  }
});

// 6 contacts ek saath save/update karo
// Body: { contacts: [{ slot: 1, name: 'Ravi', email: 'ravi@example.com' }, ...] }
router.post('/', async (req, res) => {
  try {
    const { contacts } = req.body;

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: 'Kam se kam ek contact bhejo' });
    }
    if (contacts.length > 6) {
      return res.status(400).json({ error: 'Zyada se zyada 6 contacts allowed hain' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const c of contacts) {
      if (!c.email || !emailPattern.test(c.email)) {
        return res.status(400).json({ error: `Slot ${c.slot} ka email sahi format me nahi hai` });
      }
      if (!c.slot || c.slot < 1 || c.slot > 6) {
        return res.status(400).json({ error: 'Har contact ka slot 1 se 6 ke beech hona chahiye' });
      }
    }

    const savedContacts = [];
    for (const c of contacts) {
      const updated = await Contact.findOneAndUpdate(
        { slot: c.slot },
        { name: c.name || '', email: c.email, slot: c.slot },
        { upsert: true, new: true, runValidators: true }
      );
      savedContacts.push(updated);
    }

    res.json({ message: 'Contacts save ho gaye', contacts: savedContacts });
  } catch (err) {
    res.status(500).json({ error: 'Contacts save nahi ho paaye', details: err.message });
  }
});

module.exports = router;
