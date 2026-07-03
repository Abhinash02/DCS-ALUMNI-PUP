const nodemailer = require('nodemailer');

// Create a reusable transporter object using connection pooling
const transporter = nodemailer.createTransport({
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

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'csepupalumni@gmail.com',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error(`Could not send email: ${error.message}`);
  }
};

module.exports = sendEmail;
