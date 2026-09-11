const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const MessageLog = require('../models/MessageLog');
const transporter = require('../mailer');

// Body: { text: "message content" }
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message khaali nahi ho sakta' });
    }

    const contacts = await Contact.find().sort({ slot: 1 });
    if (contacts.length === 0) {
      return res.status(400).json({ error: 'Pehle kam se kam ek contact save karo' });
    }

    const sentTo = [];

    // Har contact ko individually bhejte hain, taaki ek fail ho to
    // baaki logo tak message phir bhi pahunch jaaye
    for (const contact of contacts) {
      try {
        await transporter.sendMail({
          from: `"Broadcast" <${process.env.EMAIL_USER}>`,
          to: contact.email,
          subject: 'Aapke liye ek sandesh',
          text: text
        });
        sentTo.push({ email: contact.email, status: 'sent' });
      } catch (err) {
        sentTo.push({ email: contact.email, status: 'failed', error: err.message });
      }
    }

    const log = await MessageLog.create({ text, sentTo });

    const successCount = sentTo.filter(s => s.status === 'sent').length;
    res.json({
      message: `${successCount} me se ${contacts.length} logo ko email bhej diya gaya`,
      log
    });
  } catch (err) {
    res.status(500).json({ error: 'Message bhejne me dikkat hui', details: err.message });
  }
});

// Pichhle bheje gaye messages ki history
router.get('/history', async (req, res) => {
  try {
    const logs = await MessageLog.find().sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'History load nahi ho paayi', details: err.message });
  }
});

module.exports = router;
