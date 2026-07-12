const nodemailer = require('nodemailer');

// 1. Gmail Transporter (Fallback)
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER || 'csepupalumni@gmail.com', 
    pass: process.env.EMAIL_PASS, // 16-character App Password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 2. Brevo Transporter (Primary)
let brevoTransporter = null;
if (process.env.BREVO_EMAIL && process.env.BREVO_SMTP_PASS) {
  brevoTransporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for 587
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_SMTP_PASS,
    }
  });
}

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'csepupalumni@gmail.com',
    to,
    subject,
    html,
  };

  // Try Brevo first if available
  if (brevoTransporter) {
    try {
      await brevoTransporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to} via Brevo`);
      return; // Exit if successful
    } catch (brevoError) {
      console.warn(`Brevo failed for ${to} (${brevoError.message}). Falling back to Gmail...`);
      // Proceed to fallback
    }
  }

  // Fallback to Gmail
  try {
    await gmailTransporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} via Gmail (Fallback)`);
  } catch (gmailError) {
    console.error(`Gmail fallback also failed for ${to}:`, gmailError.message);
    throw new Error(`Could not send email. Both Brevo and Gmail failed. (${gmailError.message})`);
  }
};

module.exports = sendEmail;
