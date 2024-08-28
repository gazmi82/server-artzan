const express = require("express");
const { createGoogleMeetEvent } = require("../services/calendarService");

const router = express.Router();

// POST route to schedule a meeting
router.post("/schedule-meeting", async (req, res) => {
  try {
    const eventData = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      timeZone: req.body.timeZone,
      attendees: req.body.attendees,
      sender: req.body.sender,
    };

    const { meetingUrl, eventId } = await createGoogleMeetEvent(eventData);

    res.status(200).json({
      message: "Meeting scheduled successfully",
      meetingUrl,
      eventId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error scheduling meeting",
      error: error.message,
    });
  }
});

module.exports = router;
