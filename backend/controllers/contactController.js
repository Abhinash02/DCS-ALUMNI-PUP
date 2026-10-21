const Contact = require('../models/contact');
const sendEmail = require('../utils/sendEmail');

exports.submitContact = async (req, res) => {
  try {
    const { from_fname, from_lname, from_email, selected_option, message } = req.body;

    if (!from_fname || !from_email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    // 1. Save to Database so message is never lost
    const newContact = new Contact({
      from_fname: from_fname.trim(),
      from_lname: (from_lname || '').trim(),
      from_email: from_email.trim(),
      selected_option: selected_option || 'General Inquiry',
      message: message.trim(),
    });

    await newContact.save();

    // 2. Dispatch Email Asynchronously in background (doesn't block the HTTP response)
    const fullName = `${from_fname} ${from_lname || ''}`.trim();
    const departmentEmail = process.env.DEPARTMENT_EMAIL || process.env.EMAIL_USER || 'head_cs@pbi.ac.in';

    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #002147; border-bottom: 2px solid #0284c7; padding-bottom: 8px;">New Alumni Inquiry Received</h2>
        <p><strong>From:</strong> ${fullName} (&lt;${from_email}&gt;)</p>
        <p><strong>Topic / Area of Help:</strong> ${selected_option}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; color: #334155; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="font-size: 12px; color: #64748b;">Submitted via DCS PUP Alumni Portal.</p>
      </div>
    `;

    // Attempt to send email to Department
    sendEmail({
      to: departmentEmail,
      subject: `[DCS Alumni Portal] New Contact Inquiry: ${selected_option} from ${fullName}`,
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
