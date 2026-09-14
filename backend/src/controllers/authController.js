const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const Admin = require('../models/Admin');

const cookieName = () => process.env.COOKIE_NAME || 'nbnzia_token';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: admin._id });
  res.cookie(cookieName(), token, cookieOptions());

  res.json({
    success: true,
    data: { id: admin._id, email: admin.email, name: admin.name },
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie(cookieName(), { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { login, logout, me };
