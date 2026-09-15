const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const Admin = require("../models/Admin");
const { sendOtpEmail } = require("../utils/sendEmail");

const cookieName = () => process.env.COOKIE_NAME || "nbnzia_token";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

// POST /api/auth/login
// POST /api/auth/login  (Step 1: check password, send OTP)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otp = otp;
  admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await admin.save();

  await sendOtpEmail(admin.email, otp);

  res.json({
    success: true,
    otpRequired: true,
    message: "OTP sent to your email",
  });
});

// POST /api/auth/verify-otp  (Step 2: check OTP, actually log in)
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !admin.otp || !admin.otpExpiry) {
    throw new ApiError(401, "No OTP request found. Please login again.");
  }

  if (admin.otpExpiry < new Date()) {
    throw new ApiError(401, "OTP expired. Please login again.");
  }

  if (admin.otp !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }

  // OTP correct — clear it and issue the real login token
  admin.otp = null;
  admin.otpExpiry = null;
  await admin.save();

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
  res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { login, logout, me, verifyOtp };
