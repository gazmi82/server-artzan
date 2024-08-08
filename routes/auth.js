const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { generateAuthUrl, getToken } = require("../services/authService");

const router = express.Router();

// Route to start the OAuth2 flow
router.get(
  "/auth",
  asyncHandler((req, res) => {
    const url = generateAuthUrl();
    res.redirect(url);
  })
);

// Route to handle the OAuth2 callback
router.get(
  "/oauth2callback",
  asyncHandler(async (req, res) => {
    const { code } = req.query;
    const tokens = await getToken(code);
    res.send("Tokens obtained! Check your console.");
  })
);

module.exports = router;
