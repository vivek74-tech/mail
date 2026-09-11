const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  slot: {
    // 1 se 6 tak, taaki hamesha 6 fixed contacts rahen
    type: Number,
    required: true,
    min: 1,
    max: 6,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
