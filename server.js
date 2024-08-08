const express = require("express");
const dotenv = require("dotenv");
const emailRouter = require("./routes/email");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();

app.use("/api", emailRouter);
app.use("/api", authRouter);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("An error occurred");
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
