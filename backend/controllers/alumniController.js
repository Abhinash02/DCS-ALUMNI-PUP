const Alumni = require('../models/Alumni');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');


// Create a new alumni
exports.createAlumni = async (req, res) => {
  try {
    const {
      name,
      fathername,
      email,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills,
      otherSkill,
      sessionConsent,
      password // Added password
    } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const alumniData = {
      name,
      fathername,
      email,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills: JSON.parse(skills), // Assuming skills is sent as a JSON string
      otherSkill,
      sessionConsent,
      password: hashedPassword, // Store hashed password
      photo: req.file ? req.file.path : null // Cloudinary URL
    };

    const alumni = new Alumni(alumniData);
    await alumni.save();
    res.status(201).json({ message: 'Alumni registered successfully', alumni });
  } catch (error) {
    console.error('Error creating alumni:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!alumni.approved) {
      return res.status(403).json({ error: 'Account not approved' });
    }

    const token = jwt.sign({ userId: alumni._id, role: 'alumni' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Convert to object and remove password before sending to client
    const alumniObject = alumni.toObject();
    delete alumniObject.password;
    
    res.json({ token, alumni: alumniObject });
  } catch (err) {
    console.error('Alumni Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update alumni profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      fathername,
      phone,
      course,
      batch,
      address,
      linkedin,
      profession,
      organization,
      website,
      skills,
      otherSkill,
      sessionConsent
    } = req.body;

    const alumni = await Alumni.findById(req.user.userId);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    const updatedData = {
      name: name || alumni.name,
      fathername: fathername || alumni.fathername,
      phone: phone || alumni.phone,
      course: course || alumni.course,
      batch: batch || alumni.batch,
      address: address || alumni.address,
      linkedin: linkedin || alumni.linkedin,
      profession: profession || alumni.profession,
      organization: organization || alumni.organization,
      website: website || alumni.website,
      skills: skills ? JSON.parse(skills) : alumni.skills,
      otherSkill: otherSkill || alumni.otherSkill,
      sessionConsent: sessionConsent || alumni.sessionConsent
    };

    if (req.file) {
      // Delete old photo if exists
      if (alumni.photo) {
        const urlParts = alumni.photo.split('/');
        const fileName = urlParts.pop();
        const publicId = fileName ? fileName.split('.')[0] : null;
        if (publicId) {
          await cloudinary.uploader.destroy(`alumni/${publicId}`, { resource_type: 'image' });
        }
      }
      updatedData.photo = req.file.path;
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      req.user.userId,
      updatedData,
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', alumni: updatedAlumni });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Other controller functions (getPending, getApproved, etc.) remain unchanged

exports.getPending = async (req, res) => {
  try {
    const data = await Alumni.find({ approved: false, denied: false });
    res.json(data);
  } catch (err) {
    console.error('Get Pending Error:', err);
    res.status(500).json({ error: err.message });
  }
};




exports.getApproved = async (req, res) => {
  try {
    const alumni = await Alumni.find({ approved: true }).sort({ batch: -1 });
    res.json(alumni);
  } catch (err) {
    console.error('Get Approved Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getDenied = async (req, res) => {
  try {
    const data = await Alumni.find({ denied: true });
    res.json(data);
  } catch (err) {
    console.error('Get Denied Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const sendEmail = require('../utils/sendEmail');

exports.approveAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { approved: true, denied: false },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    
    // Send approval email
    try {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #1e3a8a;">
            <img src="https://dcsalumni.vishalpup.in/images/logo.png" alt="Punjabi University Logo" style="max-width: 120px; height: auto; display: inline-block;" />
          </div>
          <div style="background-color: #1e3a8a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Congratulations! 🎉</h1>
          </div>
          <div style="padding: 40px 30px; color: #4a5568; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Dear <strong>${alumni.name}</strong>,</p>
            <p style="font-size: 16px;">We are thrilled to inform you that your alumni account for <strong>Punjabi University Patiala (DCS)</strong> has been successfully approved.</p>
            <p style="font-size: 16px;">You can now log in to the portal using your registered email address and the password you created during registration.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://dcsalumni.vishalpup.in/#/UserLogin" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Log in to Portal</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 14px; margin-bottom: 0;">Best Regards,<br/><strong style="color: #1e3a8a;">DCS Alumni Association</strong></p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Punjabi University Patiala. All rights reserved.</p>
          </div>
        </div>
      `;
      await sendEmail({
        to: alumni.email,
        subject: 'Alumni Account Approved',
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Approval email could not be sent:', emailError);
      // We still return success even if email fails, because approval worked
    }

    res.json(alumni);
  } catch (err) {
    console.error('Approve Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.denyAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { approved: false, denied: true },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json(alumni);
  } catch (err) {
    console.error('Deny Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    if (alumni.photo) {
      const urlParts = alumni.photo.split('/');
      const fileName = urlParts.pop();
      const publicId = fileName ? fileName.split('.')[0] : null;
      if (publicId) {
        await cloudinary.uploader.destroy(`alumni/${publicId}`, { resource_type: 'image' });
      } else {
        console.warn('Could not extract publicId from photo URL:', alumni.photo);
      }
    }

    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    console.error('Delete Alumni Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    let data = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(sheet);
      data = data.concat(sheetData);
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('alumni123', saltRounds);

    const mapKey = (row, possibleKeys) => {
      for (const key of Object.keys(row)) {
        const lowerKey = key.toLowerCase().trim();
        // Exact match first
        if (possibleKeys.some(pk => lowerKey === pk.toLowerCase())) {
          return row[key];
        }
        // Partial match for tricky columns like "Passout (Year) (Punjabi text)"
        if (possibleKeys.some(pk => lowerKey.includes(pk.toLowerCase()) && pk.length > 4)) {
          return row[key];
        }
      }
      return '';
    };

    const newAlumnis = [];
    let skippedCount = 0;

    for (const row of data) {
      const email = mapKey(row, ['email', 'email address', 'email id', 'e-mail address']);
      // Skip row if email is missing or doesn't look like a valid email (missing @)
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        skippedCount++;
        continue;
      }

      const existingAlumni = await Alumni.findOne({ email });
      if (existingAlumni) {
        skippedCount++;
        continue;
      }

      const name = mapKey(row, ['name', 'full name', 'student name', 'candidate name', 'first name', 'alumni name', 'name of the student']);
      const fathername = mapKey(row, ['father name', "father's name", 'fathername']);
      const phone = String(mapKey(row, ['phone', 'mobile', 'contact', 'phone number', 'mobile number', 'contact number', 'phone no', 'contact no', 'mobile no.']));
      
      // Use the course and batch provided from the frontend form instead of extracting from Excel
      const course = req.body.course || 'N/A';
      const batch = req.body.batch || 'N/A';
      const address = mapKey(row, ['address', 'location', 'city']);
      const linkedin = mapKey(row, ['linkedin', 'linkedin profile']);
      const profession = mapKey(row, ['profession', 'job', 'designation']);
      const organization = mapKey(row, ['organization', 'company', 'employer']);
      const website = mapKey(row, ['website', 'portfolio']);
      const skillsStr = mapKey(row, ['skills', 'technical skills']);
      
      let skills = [];
      if (skillsStr && typeof skillsStr === 'string') {
        skills = skillsStr.split(',').map(s => s.trim()).filter(s => s);
      }

      const alumniData = {
        name,
        fathername,
        email,
        phone,
        course,
        batch,
        address,
        linkedin,
        profession,
        organization,
        website,
        skills,
        photo: 'https://res.cloudinary.com/alumniimages/image/upload/v1782994676/alumni/j6yggqsjfumo7uhypje3.jpg', // Default photo
        otherSkill: '',
        sessionConsent: 'No',
        password: hashedPassword,
        approved: false,
        denied: false,
      };

      newAlumnis.push(alumniData);
    }

    if (newAlumnis.length > 0) {
      await Alumni.insertMany(newAlumnis);
      
      // Send welcome emails in the background
      setTimeout(async () => {
        for (const alumni of newAlumnis) {
          try {
            const emailHtml = `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #1e3a8a;">
                  <img src="https://dcsalumni.vishalpup.in/images/logo.png" alt="Punjabi University Logo" style="max-width: 120px; height: auto; display: inline-block;" />
                </div>
                <div style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Welcome to DCS Alumni Portal</h1>
                </div>
                <div style="padding: 40px 30px; color: #4a5568; line-height: 1.6;">
                  <p style="font-size: 16px; margin-top: 0;">Dear <strong>${alumni.name || 'Alumni'}</strong>,</p>
                  <p style="font-size: 16px;">An official alumni account has been automatically created for you by the administration.</p>
                  
                  <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Your Login ID:</strong> <span style="color: #1e3a8a;">${alumni.email}</span></p>
                    <p style="margin: 0; font-size: 15px;"><strong>Temporary Password:</strong> <span style="color: #1e3a8a; font-family: monospace; font-size: 16px;">alumni123</span></p>
                  </div>
                  
                  <p style="font-size: 15px; color: #ef4444; font-weight: 500;">⚠️ Please log in and change this temporary password immediately.</p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="https://dcsalumni.vishalpup.in/#/UserLogin" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Log in Now</a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                  <p style="font-size: 14px; margin-bottom: 0;">Best Regards,<br/><strong style="color: #1e3a8a;">DCS Alumni Association</strong></p>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Punjabi University Patiala. All rights reserved.</p>
                </div>
              </div>
            `;
            await sendEmail({
              to: alumni.email,
              subject: 'Your DCS Alumni Account Created',
              html: emailHtml
            });
          } catch (err) {
            console.error(`Failed to send email to ${alumni.email}:`, err);
          }
        }
      }, 0);
    }

    res.status(200).json({ 
      message: `Successfully imported ${newAlumnis.length} alumni records. Skipped ${skippedCount} (missing email or duplicate). Welcome emails are being sent.` 
    });

  } catch (error) {
    console.error('Error uploading excel:', error);
    res.status(500).json({ error: 'Failed to process Excel file', details: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(404).json({ error: 'No account found with that email address' });
    }

    // Generate a temporary reset token valid for 15 minutes
    const resetToken = jwt.sign({ userId: alumni._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    // Use FRONTEND_URL from .env if available (for Vercel deployment), otherwise default to localhost.
    // We also include the /#/ here because your React app uses HashRouter!
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/#/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
        <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #1e3a8a;">
          <img src="https://dcsalumni.vishalpup.in/images/logo.png" alt="Punjabi University Logo" style="max-width: 120px; height: auto; display: inline-block;" />
        </div>
        <div style="background-color: #1e3a8a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Password Reset Request</h1>
        </div>
        <div style="padding: 40px 30px; color: #4a5568; line-height: 1.6;">
          <p style="font-size: 16px; margin-top: 0;">Dear <strong>${alumni.name || 'Alumni'}</strong>,</p>
          <p style="font-size: 16px;">We received a request to reset your password for the DCS Alumni Portal.</p>
          <p style="font-size: 16px;">Please click the button below to set a new password. For your security, this link will expire in exactly <strong>15 minutes</strong>.</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">Reset My Password</a>
          </div>
          
          <p style="font-size: 14px; color: #718096; background-color: #f7fafc; padding: 15px; border-radius: 6px;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged and your account is secure.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 14px; margin-bottom: 0;">Best Regards,<br/><strong style="color: #1e3a8a;">DCS Alumni Association</strong></p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Punjabi University Patiala. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset - DCS Alumni Portal',
      html: emailHtml
    });

    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

exports.sendBulkEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    // Since we are setting up SSE, we need to handle headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Prevent Nginx/Webpack proxy buffering
    res.setHeader('Content-Encoding', 'none'); // Prevent compression buffering
    res.flushHeaders();

    // Send 1KB of padding as an SSE comment to force browser/proxy buffers to flush
    res.write(':' + ' '.repeat(1024) + '\n\n');

    const emails = new Set();

    // 1. Fetch from DB
    const approvedAlumni = await Alumni.find({ approved: true });
    approvedAlumni.forEach(a => {
      if (a.email && a.email.trim()) emails.add(a.email.trim());
    });

    // 2. Fetch from aluminiData.json
    try {
      const jsonPath = path.join(__dirname, '../../Alumnii-Website-Dcs-Pup-master/src/data/aluminiData.json');
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      const parsedData = JSON.parse(jsonData);
      parsedData.forEach(a => {
        const email = a.Email || a['Email '];
        if (email && email.trim()) emails.add(email.trim());
      });
    } catch (jsonErr) {
      console.error('Error reading aluminiData.json:', jsonErr);
    }

    const emailList = Array.from(emails);
    if (emailList.length === 0) {
      res.write(`data: ${JSON.stringify({ error: 'No valid recipient email addresses found', status: 'error' })}\n\n`);
      return res.end();
    }

    const total = emailList.length;
    let sentCount = 0;
    let failedCount = 0;
    let isCancelled = false;

    req.on('close', () => {
      isCancelled = true;
    });

    res.write(`data: ${JSON.stringify({ total, sent: sentCount, failed: failedCount, status: 'started' })}\n\n`);

    // Helper function for delay
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Send emails sequentially to avoid triggering Gmail anti-spam
    for (let i = 0; i < emailList.length; i++) {
      if (isCancelled) {
        console.log('Bulk email cancelled by client.');
        break;
      }
      
      const email = emailList[i];
      try {
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #1e3a8a;">
              <img src="https://dcsalumni.vishalpup.in/images/logo.png" alt="Punjabi University Logo" style="max-width: 120px; height: auto; display: inline-block;" />
            </div>
            <div style="background-color: #1e3a8a; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">DCS Alumni Update</h1>
            </div>
            <div style="padding: 30px; color: #4a5568; line-height: 1.6;">
              ${message}
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              <p style="font-size: 14px; margin-bottom: 0;">Best Regards,<br/><strong style="color: #1e3a8a;">DCS Alumni Association</strong></p>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">© ${new Date().getFullYear()} Punjabi University Patiala. All rights reserved.</p>
            </div>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: subject,
          html: emailHtml
        });
        sentCount++;
        res.write(`data: ${JSON.stringify({ total, sent: sentCount, failed: failedCount, status: 'sending' })}\n\n`);
        
        // Add a 100ms delay between emails to avoid rate limits
        await sleep(100);
      } catch (emailErr) {
        console.error(`Failed to send to ${email}:`, emailErr.message);
        failedCount++;
        res.write(`data: ${JSON.stringify({ total, sent: sentCount, failed: failedCount, status: 'sending' })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ total, sent: sentCount, failed: failedCount, status: 'completed' })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Bulk Email Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process bulk email request' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Failed to process bulk email request', status: 'error' })}\n\n`);
      res.end();
    }
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and update password
    const alumni = await Alumni.findById(decoded.userId);
    if (!alumni) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    alumni.password = hashedPassword;
    await alumni.save();

    res.json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }
    return res.status(400).json({ error: 'Invalid or expired reset link.' });
  }
};