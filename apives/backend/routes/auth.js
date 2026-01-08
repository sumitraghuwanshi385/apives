const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Resend helper (Node 18+ has global fetch; Render Node 22 ok)
async function sendOtpViaResend(toEmail, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error('Missing RESEND_API_KEY or EMAIL_FROM');
  }

  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Use Node 18+');
  }

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject: 'Apives Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h2>Apives Password Reset</h2>
          <p>Your OTP is:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:6px;background:#f2f2f2;padding:12px 16px;border-radius:10px;display:inline-block;">
            ${code}
          </div>
          <p style="margin-top:16px;">Valid for <b>5 minutes</b>.</p>
        </div>
      `,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Resend API error ${resp.status}: ${text}`);
  }
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    return res.json({
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// FORGOT PASSWORD (Resend)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // user must exist
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP (Otp model expires in 5 mins)
    await Otp.deleteMany({ email });
    await new Otp({ email, code }).save();

    // send email via Resend
    await sendOtpViaResend(email, code);

    const showOtp = process.env.SHOW_OTP_IN_RESPONSE === 'true'; // demo/debug only
    return res.json({
      message: 'OTP sent',
      ...(showOtp ? { otp: code } : {}),
    });
  } catch (err) {
    console.error('forgot-password error:', err.message);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) return res.status(400).json({ message: 'Invalid or expired token' });

    return res.json({ message: 'Token verified' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) return res.status(400).json({ message: 'Session expired, request new OTP' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    return res.json({ message: 'Credentials successfully updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;