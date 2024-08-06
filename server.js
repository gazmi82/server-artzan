const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const app = express();
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENTID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

async function createTransporter() {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    console.log("Access Token:", accessToken);

    if (!accessToken.token) {
      throw new Error("Failed to get access token");
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Failed to create transporter:", error.message);
    throw error;
  }
}

async function sendEmail() {
  try {
    let transporter = await createTransporter();

    let mailOptions = {
      from: process.env.EMAIL, // Using the email address from the .env file
      to: process.env.EMAIL, // The recipient email is also the same as the sender email
      subject: "Nodemailer API",
      text: "Hi from your nodemailer API",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err.message);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

createTransporter()
  .then((transporter) => {
    transporter.verify((err, success) => {
      if (err) {
        console.log("Transporter verification failed:", err.message);
      } else {
        console.log(`=== Server is ready to take messages: ${success} ===`);
        sendEmail();
      }
    });
  })
  .catch((error) => {
    console.error("Error creating transporter:", error.message);
  });

const port = 3001;
app
  .listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err.message);
  });
