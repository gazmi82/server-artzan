const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { createTransporter, sendEmail } = require("../services/emailService");

const router = express.Router();

router.get(
  "/send-email",
  asyncHandler(async (req, res) => {
    const transporter = await createTransporter();
    await transporter.verify();
    await sendEmail(transporter);
    res.send("Email sent successfully");
  })
);

console.log(typeof router); // Should output 'function'

module.exports = router;
