const express = require("express");
const { sendMeetingRequest } = require("../services/calendarService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/schedule-meeting",
  asyncHandler(async (req, res) => {
    const {
      summary,
      location,
      description,
      start,
      end,
      sender,
      meetingUrl,
      timeZone,
    } = req.body;

    const eventData = {
      summary,
      location,
      description: `${description}\nMeeting URL: ${meetingUrl}`,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      timeZone: timeZone,
      sender,
      meetingUrl,
    };

    try {
      // Send the meeting request and save the event to MongoDB
      await sendMeetingRequest(eventData);

      res.status(200).json({ message: "Meeting request sent and event saved" });
    } catch (error) {
      res.status(500).json({
        message: "Error sending meeting request or saving event",
        error: error.message,
      });
    }
  })
);

module.exports = router;
