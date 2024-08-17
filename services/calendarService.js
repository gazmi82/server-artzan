const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const nodemailer = require("nodemailer");
const Event = require("../models/Event"); // Import the Event model
const credentials = require("../artz.json"); // Update the path to your credentials file
require("dotenv").config();

const jwtClient = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

const calendar = google.calendar({ version: "v3", auth: jwtClient });

const createGoogleMeetEvent = async (eventData) => {
  try {
    // Authorize the JWT client
    await jwtClient.authorize();

    // Create a Google Calendar event with a Google Meet link
    const event = {
      summary: eventData.summary,
      location: eventData.location,
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: eventData.timeZone || "America/Los_Angeles", // Allow dynamic timezone or default
      },
      end: {
        dateTime: eventData.end,
        timeZone: eventData.timeZone || "America/Los_Angeles", // Allow dynamic timezone or default
      },

      conferenceData: {
        createConferenceRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Required to generate Google Meet link
      sendNotifications: true,
    });

    const meetingUrl = response?.data?.hangoutLink;
    console.log("Meeting url reeeesponse", response?.data?.meetingUrl);

    console.log("Meeting URL generated:", meetingUrl);

    // Save the event to MongoDB
    const savedEvent = new Event({
      summary: eventData.summary,
      location: eventData.location,
      description: `${eventData.description}\nMeeting URL: ${meetingUrl}`, // Include meeting URL in the description
      start: eventData.start,
      end: eventData.end,
      timeZone: eventData.timeZone || "America/Los_Angeles", // Save timezone for consistency
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
