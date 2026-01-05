const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

// Gmail SMTP via SSL (demo-friendly)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // SSL port
  secure: true,       // true for 465
  auth: {
    user: process.env.EMAIL_USER, // tumhara gmail
    pass: process.env.EMAIL_PASS  // 16-char app password
  },
  timeout: 15000      // 15 sec timeout, taaki lamba hang na ho
});


// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 1. FORGOT PASSWORD
// 1. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });
    await new Otp({ email, code }).save();

    // Email bhejne ki koshish karo, lekin fail ho jaaye to flow break mat karo
    try {
      await transporter.sendMail({
        from: `"Mora Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Identity Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Identity Recovery Protocol</h2>
            <p>You requested a secure access token for your Mora account.</p>
            <h1 style="background: #eee; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 5px;">${code}</h1>
            <p>This token is valid for <strong>5 minutes</strong>.</p>
            <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this signal.</p>
          </div>
        `
      });
      console.log('OTP email sent to', email);
    } catch (mailErr) {
      console.error('Email send failed (demo mode):', mailErr.message);
      // yahan 500 nahi bhej rahe, sirf log kar rahe hain
    }

    // User ko hamesha success message de do (OTP DB me already save ho chuka hai)
    res.json({ message: "Secure token dispatched" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process request" });
  }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOtp = await Otp.findOne({ email, code: otp });

    if (!validOtp) return res.status(400).json({ message: "Invalid or expired token" });

    res.json({ message: "Token verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    
    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) return res.status(400).json({ message: "Session expired, please request new token" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.json({ message: "Credentials successfully updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ SABSE END MEIN HONA CHAHIYE
module.exports = router;