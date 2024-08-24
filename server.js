const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const subscribeRouter = require("./routes/subscribe");
const calendarRouter = require("./routes/calendar");
const calendarListRoutes = require("./routes/calendarList");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

app.use("/api", subscribeRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/calendar", calendarListRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("An error occurred");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
