const express = require("express");
const { listEvents } = require("../services/calendarListService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/calendars-list",
  asyncHandler(async (req, res) => {
    const { calendarId, maxResults } = req.body; // Extract from body

    try {
      const events = await listEvents(calendarId, maxResults);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching calendar events",
        error: error.message,
      });
    }
  })
);

module.exports = router;
