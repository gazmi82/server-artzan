const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { handleSubscription } = require("../services/emailService");

const router = express.Router();

router.post(
  "/subscribe",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await handleSubscription(email);

    res.status(200).json({ message: "Subscription successful" });
  })
);

module.exports = router;
