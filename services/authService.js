const { google } = require("googleapis");
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENTID,
  process.env.OAUTH_CLIENT_SECRET,
  "http://localhost:3001/api/oauth2callback" // Ensure the redirect URI matches
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

oauth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    console.log("Refresh Token:", tokens.refresh_token);
  }
  console.log("Access Token:", tokens.access_token);
});

const generateAuthUrl = () => {
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

const getToken = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    const tokens = await oauth2Client.getAccessToken();
    return tokens.token;
  } catch (error) {
    console.error(
      "Error obtaining access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = { generateAuthUrl, getToken, getAccessToken, oauth2Client };
