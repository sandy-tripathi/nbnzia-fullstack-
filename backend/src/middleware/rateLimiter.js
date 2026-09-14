const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent from this device. Please try again later.',
  },
});

module.exports = { contactLimiter };
