const express = require('express');
const sanityClient = require('@sanity/client').default;
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configure Sanity client
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_SECRET_TOKEN,
  apiVersion: "2022-02-01",
  useCdn: false,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'YOUR_EMAIL_SERVICE',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

// Listen for Sanity document creation
app.post('/sanity/webhook', (req, res) => {
  const { name, email, message } = req.body;

  // Send email using Nodemailer
  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: process.env.MAILER_RECEIVER,
    subject: 'New message portfolio',
    text: `Hello Achraf, you have a new message from ${name} - ${email}.\n\nContent: ${message}\n\nPlease consult the portfolio for more information.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
