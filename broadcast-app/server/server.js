require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const contactsRouter = require('./routes/contacts');
const sendRouter = require('./routes/send');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/send', sendRouter);

app.get('/', (req, res) => {
  res.send('Broadcast server chal raha hai');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB se connect ho gaya');
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT} par chal raha hai`));
  })
  .catch(err => {
    console.error('MongoDB connect nahi ho paaya:', err.message);
  });
