const express = require('express');
const {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateBody, contactSchema, contactStatusSchema } = require('../validators/schemas');

const router = express.Router();

// Public — rate-limited + validated
router.post('/', contactLimiter, validateBody(contactSchema), createSubmission);

// Admin-only
router.get('/', protect, getSubmissions);
router.patch('/:id', protect, validateBody(contactStatusSchema), updateSubmissionStatus);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;
