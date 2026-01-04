const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 100 },
  apiKeys: [String],
  subscriptions: [String],
  bookmarks: [String]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);