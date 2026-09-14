const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ContactSubmission = require('../models/ContactSubmission');
const { sendContactNotification } = require('../utils/sendEmail');

// POST /api/contact (public, rate-limited, validated)
const createSubmission = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const submission = await ContactSubmission.create({
    name,
    email,
    message,
    ip: req.ip,
  });

  // Best-effort — never block/fail the user-facing request on email delivery.
  sendContactNotification(submission).catch(() => {});

  res.status(201).json({
    success: true,
    message: "Thanks — your message has been sent. I'll get back to you soon.",
    data: { id: submission._id },
  });
});

// GET /api/contact (admin) — supports ?status=unread&search=text&page=1&limit=20
const getSubmissions = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

  const [items, total, unreadCount] = await Promise.all([
    ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    ContactSubmission.countDocuments(filter),
    ContactSubmission.countDocuments({ status: 'unread' }),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1, unreadCount },
  });
});

// PATCH /api/contact/:id (admin) — update status
const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const submission = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!submission) throw new ApiError(404, 'Submission not found');
  res.json({ success: true, data: submission });
});

// DELETE /api/contact/:id (admin)
const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!submission) throw new ApiError(404, 'Submission not found');
  res.json({ success: true, message: 'Submission deleted' });
});

module.exports = { createSubmission, getSubmissions, updateSubmissionStatus, deleteSubmission };
