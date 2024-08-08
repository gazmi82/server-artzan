const nodemailer = require("nodemailer");
const { getAccessToken } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
require("dotenv").config();

const createTransporter = asyncHandler(async () => {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
});

const sendEmail = asyncHandler(async (transporter) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Nodemailer API",
    text: "Hi from your nodemailer API",
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
});

module.exports = { createTransporter, sendEmail };
