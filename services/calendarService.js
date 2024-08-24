const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Event = require("../models/Event");
require("dotenv").config();

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/meetings.space.created",
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar.events",
];

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
  scopes
);

// Set the credentials with the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const createGoogleMeetEvent = async (eventData) => {
  try {
    // Ensure the client is authorized by getting a fresh access token
    await oauth2Client.getAccessToken();

    // Create a Google Calendar event with a Google Meet link
    const event = {
      summary: eventData.summary,
      location: eventData.location,
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: eventData.timeZone || "America/Los_Angeles",
      },
      end: {
        dateTime: eventData.end,
        timeZone: eventData.timeZone || "America/Los_Angeles",
      },
      attendees: [
        { email: "gsulcaj22@gmail.com" },
        { email: "artizan.collaboration@gmail.com" },
      ],
      conferenceData: {
        createConferenceRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendNotifications: true,
    });

    const meetingUrl = response?.data?.hangoutLink;
    console.log("Meeting URL generated:", response);

    // Save the event to MongoDB
    const savedEvent = new Event({
      summary: eventData.summary,
      location: eventData.location,
      description: `${eventData.description}\nMeeting URL: ${meetingUrl}`,
      start: eventData.start,
      end: eventData.end,
      timeZone: eventData.timeZone || "America/Los_Angeles",
    });

    await savedEvent.save();
    console.log("Event saved to MongoDB: %s", savedEvent._id);

    return { meetingUrl, eventId: response.data.id };
  } catch (error) {
    console.error("Error creating Google Meet event:", error);
    throw error;
  }
};

const sendMeetingRequest = async (eventData) => {
  try {
    // Create the Google Meet event
    const { meetingUrl } = await createGoogleMeetEvent(eventData);

    // Include the meeting URL in the email body
    const content = `BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nSUMMARY:${eventData.summary}\r\nLOCATION:${eventData.location}\r\nDESCRIPTION:${eventData.description}\nMeeting URL: ${meetingUrl}\r\nDTSTART:${eventData.start}\r\nDTEND:${eventData.end}\r\nEND:VEVENT\r\nEND:VCALENDAR`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const message = {
      from: eventData.sender,
      to: process.env.EMAIL, // Adjust this to send to the intended recipient
      subject: "Meeting Request: " + eventData.summary,
      text: `Please see the attached meeting request.\nMeeting URL: ${meetingUrl}`,
      icalEvent: {
        filename: "invitation.ics",
        method: "request",
        content: content,
      },
    };

    const info = await transporter.sendMail(message);
    console.log("Meeting request sent: %s", info.response);

    return info;
  } catch (error) {
    console.error("Error sending meeting request:", error);
    throw error;
  }
};

module.exports = { createGoogleMeetEvent, sendMeetingRequest };
