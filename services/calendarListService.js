const { google } = require("googleapis");
require("dotenv").config();

const listEvents = async (calendarId, maxResults) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId,
      maxResults,
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};

module.exports = { listEvents };
