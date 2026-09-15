const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendCustomEmail } = require("../utils/sendEmail");

// POST /api/messages/send  (admin only)
const sendMessage = asyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !message) {
    throw new ApiError(400, "Recipient email and message are required");
  }

  const result = await sendCustomEmail({ to, subject, message });

  if (!result.sent) {
    throw new ApiError(500, "Failed to send email. Check SMTP configuration.");
  }

  res.json({ success: true, message: "Email sent successfully" });
});

module.exports = { sendMessage };
