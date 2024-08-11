const Subscriber = require("../models/Subscriber");
const asyncHandler = require("../utils/asyncHandler");

const handleSubscription = asyncHandler(async (email) => {
  // Save the email to a database, log it, etc.
  const existingSuscriber = await Subscriber.findOne({ email });

  if (existingSuscriber) {
    throw new Error("Email already exist");
  }

  // Create new subscr
  const newSubscriber = await Subscriber.create({ email });
  // Save the subscr
  await newSubscriber.save();

  console.log(`Received subscription from email: ${email}`);

  // Simulate some processing time
  return new Promise((resolve) => setTimeout(resolve, 500));
});

module.exports = { handleSubscription };
