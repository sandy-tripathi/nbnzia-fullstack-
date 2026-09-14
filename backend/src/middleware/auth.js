const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/Admin');

/**
 * Requires a valid JWT (from the httpOnly cookie, or Authorization: Bearer
 * header as a fallback for non-browser clients) and attaches req.admin.
 */
const protect = asyncHandler(async (req, res, next) => {
  const cookieName = process.env.COOKIE_NAME || 'nbnzia_token';
  let token = req.cookies?.[cookieName];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Session expired or invalid, please log in again');
  }

  const admin = await Admin.findById(decoded.id).select('_id email name');
  if (!admin) {
    throw new ApiError(401, 'Account no longer exists');
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
