const Contact = require('../models/contact');
const Alumni = require('../models/Alumni');
const sendEmail = require('../utils/sendEmail');

exports.submitContact = async (req, res) => {
  try {
    const { from_fname, from_lname, from_email, phone, selected_option, message } = req.body;

    if (!from_fname || !from_email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    const cleanEmail = from_email.trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    // 1. Cross-reference if the sender is an existing registered alumnus in the database
    let matchingAlumnus = null;
    try {
      matchingAlumnus = await Alumni.findOne({
        email: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      }).lean();
    } catch (alumniErr) {
      console.warn('Alumni lookup error during contact submission:', alumniErr.message);
    }

    // 2. Save to Database so inquiry is permanently recorded
    const newContact = new Contact({
      from_fname: from_fname.trim(),
      from_lname: (from_lname || '').trim(),
      from_email: cleanEmail,
      phone: cleanPhone || matchingAlumnus?.phone || '',
      alumniId: matchingAlumnus?._id || null,
      selected_option: selected_option || 'General Inquiry',
      message: message.trim(),
    });

    await newContact.save();

    // 3. Dispatch Email Asynchronously in background with FULL sender details
    const fullName = `${from_fname} ${from_lname || ''}`.trim();
    const adminEmail = process.env.ALUMNI_ADMIN_EMAIL || process.env.EMAIL_USER || 'csepupalumni@gmail.com';
    const departmentEmail = process.env.DEPARTMENT_EMAIL || 'head_cs@pbi.ac.in';
    const recipientList = [adminEmail, departmentEmail].filter(Boolean).join(', ');

    const senderPhone = cleanPhone || matchingAlumnus?.phone || 'Not provided';
    const formattedTimestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const isAlumnus = !!matchingAlumnus;

    const alumniDossierHtml = isAlumnus
      ? `
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin: 18px 0;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
              Verified DCS Alumnus
            </span>
            ${
              matchingAlumnus.approved
                ? '<span style="background-color: #16a34a; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 999px;">Approved Portal Member</span>'
                : '<span style="background-color: #ea580c; color: #ffffff; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 999px;">Registration Pending</span>'
            }
          </div>
          <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; width: 140px; font-weight: 600; color: #64748b;">Course / Degree:</td>
              <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${matchingAlumnus.course || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #64748b;">Passing Batch:</td>
              <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${matchingAlumnus.batch || 'Not specified'}</td>
            </tr>
            ${
              matchingAlumnus.profession || matchingAlumnus.organization
                ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #64748b;">Current Role:</td>
              <td style="padding: 4px 0; color: #0f172a;">${matchingAlumnus.profession || 'Professional'} at <strong>${matchingAlumnus.organization || 'N/A'}</strong></td>
            </tr>`
                : ''
            }
            ${
              matchingAlumnus.linkedin
                ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #64748b;">LinkedIn:</td>
              <td style="padding: 4px 0;"><a href="${matchingAlumnus.linkedin}" style="color: #0284c7; text-decoration: underline;" target="_blank">${matchingAlumnus.linkedin}</a></td>
            </tr>`
                : ''
            }
            ${
              matchingAlumnus.address
                ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #64748b;">Location:</td>
              <td style="padding: 4px 0; color: #0f172a;">${matchingAlumnus.address}</td>
            </tr>`
                : ''
            }
          </table>
        </div>
      `
      : `
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 12px 16px; margin: 18px 0; font-size: 12px; color: #64748b;">
          <strong>Sender Status:</strong> Guest / External Visitor (No matching registered portal alumnus account found for ${cleanEmail}).
        </div>
      `;

    const notificationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #002147 0%, #003e6b 50%, #0284c7 100%); padding: 24px 28px; border-radius: 14px; margin-bottom: 24px; color: #ffffff;">
          <span style="display: inline-block; background-color: rgba(255,255,255,0.18); color: #bae6fd; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px;">
            Inbound Portal Communication
          </span>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
            New Contact Inquiry Received
          </h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #e0f2fe;">
            Department of Computer Science • Punjabi University, Patiala
          </p>
        </div>

        <!-- Sender Detailed Info Table -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            Sender Information & Contact Details
          </h3>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; width: 150px; font-weight: 600; color: #64748b;">Full Name:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #0f172a; font-size: 15px;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Email Address:</td>
              <td style="padding: 6px 0;">
                <a href="mailto:${cleanEmail}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">
                  ${cleanEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Contact Phone:</td>
              <td style="padding: 6px 0; color: #0f172a;">
                ${
                  senderPhone !== 'Not provided'
                    ? `<a href="tel:${senderPhone}" style="color: #0284c7; text-decoration: underline; font-weight: 600;">${senderPhone}</a>`
                    : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Category / Topic:</td>
              <td style="padding: 6px 0;">
                <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700; font-size: 12px; padding: 3px 10px; border-radius: 8px;">
                  ${selected_option}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Date & Time:</td>
              <td style="padding: 6px 0; color: #475569; font-size: 13px;">${formattedTimestamp} (IST)</td>
            </tr>
          </table>
        </div>

        <!-- Alumni Profile Dossier Snapshot -->
        ${alumniDossierHtml}

        <!-- Message Body -->
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 800;">
            Message Content
          </h3>
          <div style="background-color: #ffffff; border: 1.5px solid #cbd5e1; border-left: 5px solid #0284c7; border-radius: 10px; padding: 18px 20px; font-size: 15px; color: #1e293b; line-height: 1.7; white-space: pre-wrap;">${message}</div>
        </div>

        <!-- Quick Action Reply Buttons -->
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 12px; font-size: 13px; color: #475569; font-weight: 600;">
            Direct Actions for Department Admins:
          </p>
          <a href="mailto:${cleanEmail}?subject=Re: [DCS Alumni Portal] ${encodeURIComponent(selected_option)}" style="display: inline-block; background-color: #002147; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 10px; margin-right: 8px;">
            ✉️ Reply to ${from_fname}
          </a>
          ${
            senderPhone !== 'Not provided'
              ? `<a href="tel:${senderPhone}" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 10px;">
                  📞 Call ${senderPhone}
                </a>`
              : ''
          }
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
          <p style="margin: 0 0 4px;">This message was submitted via the official <strong>Punjabi University Patiala DCS Alumni Portal</strong>.</p>
          <p style="margin: 0;">Replying directly to this email will send your response directly to <strong>${fullName}</strong> &lt;${cleanEmail}&gt;.</p>
        </div>
      </div>
    `;

    // Send email to csepupalumni@gmail.com and department head
    sendEmail({
      to: recipientList,
      replyTo: cleanEmail,
      subject: `[DCS Alumni Portal] New Inquiry from ${fullName} - ${selected_option}`,
      html: notificationHtml,
    }).catch((emailErr) => {
      console.warn('Background contact email notification error:', emailErr.message);
    });

    // Confirmation email to the sender
    const senderConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #002147; border-bottom: 2px solid #0284c7; padding-bottom: 8px;">Department of Computer Science</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for reaching out to the DCS Alumni Association at Punjabi University, Patiala.</p>
        <p>We have successfully received your inquiry regarding <strong>"${selected_option}"</strong>. Our departmental coordinator or alumni committee representative will review your message and connect with you shortly.</p>
        <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #0284c7; margin: 15px 0;">
          <p style="margin: 0; font-size: 13px; color: #475569;"><em>"${message}"</em></p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Warm regards,<br/>
          <strong>Department of Computer Science</strong><br/>
          Punjabi University, Patiala - 147002, Punjab, India
        </p>
      </div>
    `;

    sendEmail({
      to: from_email,
      subject: 'Thank you for contacting DCS PUP Alumni Association',
      html: senderConfirmationHtml,
    }).catch((confErr) => {
      console.warn('Background confirmation email error:', confErr.message);
    });

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! We will get back to you soon.',
      contactId: newContact._id,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ error: 'Failed to process inquiry. Please try again later.' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
