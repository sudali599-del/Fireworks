const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, otp } = req.body;
    const recipientEmail = (email && email.trim()) ? email.trim() : 'sudali599@gmail.com';
    const senderEmail = process.env.SENDER_EMAIL || 'sudali599@gmail.com';
    const mailPassword = process.env.MAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || 'aalfrphjajyiiwdj';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: mailPassword.replace(/\s+/g, ''),
      },
    });

    const mailOptions = {
      from: `"Selvaganapathy Traders Security" <${senderEmail}>`,
      to: `${recipientEmail}, selvaganapathytraders@gmail.com`,
      subject: `🔑 Admin Login OTP Verification Code: ${otp}`,
      text: `Selvaganapathy Traders - Admin Access OTP\n\nYour 6-digit Admin Login Verification Code is: ${otp}\n\nValid for 5 minutes. Do not share this code.\nEmergency Master PIN: 599599\n\nSelvaganapathy Traders, Sivakasi`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <!-- Brand Header -->
          <div style="background: linear-gradient(135deg, #1e1b4b, #831843); padding: 20px; text-align: center; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 20px; color: #fde047;">SELVAGANAPATHY TRADERS</h1>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #fbcfe8;">Admin Control Panel • Two-Factor Authentication</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 8px; margin-top: 15px; text-align: center; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 16px;">🔐 Administrator Access Verification</h3>
            <p style="color: #475569; font-size: 13px; margin: 0 0 16px 0;">
              Use the single-use 6-digit verification code below to unlock the Sivakasi Catalog Management Panel:
            </p>

            <!-- OTP Box -->
            <div style="background: #0f172a; color: #fde047; padding: 16px 24px; border-radius: 8px; font-size: 32px; font-weight: 900; letter-spacing: 8px; display: inline-block; margin: 10px 0; font-family: monospace;">
              ${otp}
            </div>

            <p style="color: #ef4444; font-size: 11px; font-weight: bold; margin: 12px 0 0 0;">
              ⚠️ Valid for 5 minutes. Do not share this code with anyone.
            </p>
            <p style="color: #64748b; font-size: 10px; margin: 6px 0 0 0;">
              Emergency Master Security PIN: <strong>599599</strong>
            </p>
          </div>

          <div style="text-align: center; padding: 15px 0 5px 0; color: #94a3b8; font-size: 11px;">
            Selvaganapathy Traders • Kananjampatti - Sivakasi, Tamil Nadu
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'OTP dispatched successfully' });
  } catch (error) {
    console.error('send-otp error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};
