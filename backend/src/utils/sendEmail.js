const nodemailer = require('nodemailer');

/**
 * Best-effort email notification for new contact submissions.
 * If SMTP env vars are not configured, this silently no-ops so the
 * contact form still works end-to-end (submission is always saved to
 * MongoDB regardless of email delivery).
 */
async function sendContactNotification(submission) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_NOTIFY_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_NOTIFY_EMAIL) {
    console.log('[email] SMTP not configured — skipping notification email (submission still saved).');
    return { sent: false, reason: 'not_configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"NBNZIA Website" <${SMTP_USER}>`,
      to: CONTACT_NOTIFY_EMAIL,
      replyTo: submission.email,
      subject: `New lead: ${submission.name}`,
      text: `From: ${submission.name} <${submission.email}>\n\n${submission.message}`,
      html: `<p><strong>From:</strong> ${submission.name} (${submission.email})</p><p>${submission.message.replace(/\n/g, '<br/>')}</p>`,
    });

    return { sent: true };
  } catch (err) {
    console.error('[email] Failed to send notification:', err.message);
    return { sent: false, reason: 'send_failed' };
  }
}

module.exports = { sendContactNotification };
