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
      subject: 'Apives Verification Code',
      html: `
<body style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="520" cellpadding="0" cellspacing="0" style="background:#111;border-radius:20px;padding:40px;border:1px solid #1f1f1f;box-shadow:0 0 40px rgba(34,197,94,0.1);">

<tr>
<td align="center" style="padding-bottom:20px;">
<img src="https://res.cloudinary.com/dp7avkarg/image/upload/f_auto,q_auto/apives-logo_kgcnxp.png" width="120"/>
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:10px;">
<h2 style="color:#fff;margin:0;font-size:22px;">
Verify Your Account
</h2>
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:25px;">
<p style="color:#9ca3af;font-size:14px;margin:0;">
Use the OTP below to continue with Apives
</p>
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:25px;">
<div style="
display:inline-block;
padding:18px 28px;
background:#0f172a;
border:1px solid #22c55e;
border-radius:14px;
font-size:30px;
letter-spacing:10px;
color:#22c55e;
font-weight:bold;
">
${code}
</div>
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:30px;">
<p style="color:#6b7280;font-size:13px;margin:0;">
Valid for 5 minutes • Do not share this code
</p>
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:30px;">
<a href="https://apives.com"
style="
background:#22c55e;
color:#000;
padding:12px 26px;
border-radius:999px;
text-decoration:none;
font-weight:bold;
font-size:14px;
display:inline-block;
">
Open Apives →
</a>
</td>
</tr>

<tr>
<td align="center" style="border-top:1px solid #1f1f1f;padding-top:20px;">
<p style="color:#6b7280;font-size:12px;margin:0;">
Built for builders 🚀 — Apives
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
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
await user.save();

// ✅ OTP GENERATE
const code = Math.floor(100000 + Math.random() * 900000).toString();

// ✅ OLD OTP DELETE
await Otp.deleteMany({ email });

// ✅ SAVE OTP
await new Otp({ email, code }).save();

// ✅ SEND OTP EMAIL (same function jo forgot me use ho rha)
await sendOtpViaResend(email, code);

// ❌ TOKEN MAT DE ABHI
return res.json({
  message: 'Signup successful, OTP sent',
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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
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

    // ✅ USER VERIFY MARK
await User.findOneAndUpdate({ email }, { isVerified: true });

// ✅ USER FETCH
const user = await User.findOne({ email });

// ✅ TOKEN GENERATE (AB LOGIN HOGA)
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET
);

return res.json({
  message: 'Verified',
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});
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