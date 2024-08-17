const asyncHandler = require("../utils/asyncHandler");
const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter (configure this according to your email provider)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email address from .env
    pass: process.env.PASS,
  },
});

const handleSubscription = asyncHandler(async (email) => {
  // Check if the email already exists in the database
  const existingSubscriber = await Subscriber.findOne({ email });

  if (existingSubscriber) {
    throw new Error("Email already subscribed");
  }

  // Create a new subscriber and save it to the database
  const newSubscriber = new Subscriber({ email });
  await newSubscriber.save();
  console.log(`Subscribed email: ${email}`);

  // Fetch the stored email from the database
  const savedSubscriber = await Subscriber.findOne({ email });

  if (!savedSubscriber) {
    throw new Error("Failed to fetch the saved email");
  }

  // Send an email on behalf of the subscriber
  const mailOptions = {
    from: process.env.EMAIL, // Your email address
    to: savedSubscriber.email, // Send to the subscriber's email
    subject: "Subscription Confirmation",
    text: `Thank you for subscribing! You have successfully subscribed with the email: ${savedSubscriber.email}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Confirmation email sent to: ${savedSubscriber.email}`);
});

module.exports = { handleSubscription };
