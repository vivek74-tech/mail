const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sentTo: [{
    email: String,
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    error: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('MessageLog', messageLogSchema);
