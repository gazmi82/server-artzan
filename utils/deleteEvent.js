const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function deleteEventsFromDate(date) {
  try {
    // Define the start and end times for the date
    const startTime = new Date(date).toISOString();
    const endTime = new Date(
      new Date(date).setDate(new Date(date).getDate() + 1)
    ).toISOString();

    // Get all events on the specified date
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: "startTime",
    });

    if (events.data.items.length) {
      // Loop through the events and delete them
      for (const event of events.data.items) {
        await calendar.events.delete({
          calendarId: "primary",
          eventId: event.id,
        });
        console.log(`Deleted event: ${event.summary}`);
      }
    } else {
      console.log("No events found for this date.");
    }
  } catch (error) {
    console.error("Error deleting events: ", error);
  }
}

// Example usage: delete events on August 25, 2024
deleteEventsFromDate("2024-08-31");
