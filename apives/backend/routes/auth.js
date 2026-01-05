const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Optional nodemailer (fallback only). If not installed, app won't crash.
let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

/**
 * Optional Gmail transporter (Render par aksar timeout hota hai).
 * We never await sendMail in forgot-password, so UI hang nahi hoga.
 */
let gmailTransporter = null;
if (nodemailer && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  gmailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 7000,
  });
}

/**
 * Resend HTTP API sender (BEST for Render because it uses HTTPS/443).
 * Needs:
 *   RESEND_API_KEY
 *   EMAIL_FROM  (e.g. onboarding@resend.dev for testing)
 */
async function sendOtpViaResend(toEmail, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY or EMAIL_FROM missing');
  }

  // Node v22+ has global fetch (Render logs show v22.x)
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject: 'Your Identity Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Identity Recovery Protocol</h2>
          <p>Your OTP is:</p>
          <h1 style="background:#eee;padding:10px;border-radius:6px;display:inline-block;letter-spacing:5px;">
            ${code}
          </h1>
          <p>This token is valid for <strong>5 minutes</strong>.</p>
        </div>
      `,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Resend API error ${resp.status}: ${text}`);
  }
}

/**
 * Unified email sending:
 * 1) Try Resend (recommended)
 * 2) Fallback to Gmail SMTP if configured
 */
async function sendOtpEmail(toEmail, code) {
  // Prefer Resend if API key exists
  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    await sendOtpViaResend(toEmail, code);
    return;
  }

  // Fallback to Gmail SMTP
  if (gmailTransporter) {
    await gmailTransporter.sendMail({
      from: `"Apives Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your Identity Verification Code',
      html: `<h1 style="letter-spacing:5px">${code}</h1><p>Valid for 5 minutes.</p>`,
    });
    return;
  }

  // No email provider configured
  throw new Error('No email provider configured (set RESEND_API_KEY+EMAIL_FROM OR EMAIL_USER+EMAIL_PASS)');
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
    res.json({
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FORGOT PASSWORD (NON-BLOCKING)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });
    await new Otp({ email, code }).save();

    // ✅ Respond immediately so frontend spinner stops
    const showOtp = process.env.SHOW_OTP_IN_RESPONSE === 'true'; // demo/debug only
    res.json({
      message: 'Secure token dispatched',
      ...(showOtp ? { otp: code } : {}),
    });

    // ✅ Send email in background (DO NOT await)
    setImmediate(() => {
      sendOtpEmail(email, code).catch((e) => {
        console.error('OTP email failed (background):', e.message);
      });
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Failed to process request' });
    }
  }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) return res.status(400).json({ message: 'Invalid or expired token' });

    res.json({ message: 'Token verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const validOtp = await Otp.findOne({ email, code: otp });
    if (!validOtp) return res.status(400).json({ message: 'Session expired, please request new token' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteMany({ email });

    res.json({ message: 'Credentials successfully updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;