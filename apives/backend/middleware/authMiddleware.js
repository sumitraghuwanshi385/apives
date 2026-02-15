const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied - No Token' });
  }

  try {
    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT PART
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(400).json({ message: 'Invalid Token' });
  }
};