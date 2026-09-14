const express = require('express');
const { login, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateBody, loginSchema } = require('../validators/schemas');

const router = express.Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
