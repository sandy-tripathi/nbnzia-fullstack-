const mongoose = require('mongoose');

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'A valid email is required',
      },
    },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'archived'],
      default: 'unread',
      index: true,
    },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactSubmission', ContactSubmissionSchema);
