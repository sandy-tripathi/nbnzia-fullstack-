const express = require("express");
const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/send", protect, sendMessage);

module.exports = router;
