
# Server Artizan

## Introduction

Server Artizan is a Node.js-based server application that handles subscription management and calendar event scheduling with integration to Google Calendar. It provides endpoints for users to subscribe to mailing lists and schedule meetings, complete with email notifications.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

To install and run the Server Artizan project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/gazmi82/server-artzan.git
    cd server-artzan
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGODB_URI=<your-mongodb-uri>
    EMAIL=<your-email-address>
    PASS=<your-email-password>
    ```

4. Start the server:
    ```bash
    npm start
    ```

The server will run on `http://localhost:3001`.

## Usage

### Subscription

To subscribe a user to the mailing list, send a POST request to `/api/subscribe` with the following payload:

```json
{
  "email": "user@example.com"
}
```

### Schedule a Meeting

To schedule a meeting and generate a Google Meet link, send a POST request to `/api/calendar/schedule-meeting` with the following payload:

```json
{
  "summary": "Team Meeting",
  "location": "Online",
  "description": "Discuss project progress",
  "start": "2024-08-20T10:00:00Z",
  "end": "2024-08-20T11:00:00Z",
  "sender": "organizer@example.com",
  "meetingUrl": "https://meet.google.com/xyz-abc-pqr"
}
```

## Features

- **Subscription Management:** Users can subscribe to a mailing list, and the system will store their email addresses in a MongoDB database.
- **Email Notifications:** A confirmation email is sent to the user upon successful subscription.
- **Meeting Scheduling:** Schedule meetings using Google Calendar API with automatic generation of Google Meet links.
- **Event Storage:** Scheduled events are stored in MongoDB for future reference.

## API Endpoints

### `/api/subscribe`
- **POST**: Subscribes a user to the mailing list.

### `/api/calendar/schedule-meeting`
- **POST**: Schedules a meeting and generates a Google Meet link.

## Configuration

Ensure that the following environment variables are set in your `.env` file:

- `MONGODB_URI`: MongoDB connection string.
- `EMAIL`: Email address used for sending notifications.
- `PASS`: Password for the email address.

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [googleapis](https://www.npmjs.com/package/googleapis)
- [dotenv](https://www.npmjs.com/package/dotenv)

You can find all dependencies in the `package.json` file.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
