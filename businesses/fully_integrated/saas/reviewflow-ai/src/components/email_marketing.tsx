import React, { FC, useState } from 'react';
import nodemailer from 'nodemailer';

interface Props {
  subject: string;
  message: string;
  to?: string; // Add optional 'to' field for email recipient
}

const MyComponent: FC<Props> = ({ subject, message, to = 'customer@example.com' }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    try {
      await sendEmail({ subject, message, to });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>{subject}</h2>
      <p>{message}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  // Configure your email service provider here (e.g., Gmail, SendGrid, etc.)
});

// Function to send an email using the transporter
const sendEmail = async (props: Props) => {
  try {
    const mailOptions = {
      from: 'your-email@example.com',
      to: props.to,
      subject: props.subject,
      text: props.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default MyComponent;

import React, { FC, useState } from 'react';
import nodemailer from 'nodemailer';

interface Props {
  subject: string;
  message: string;
  to?: string; // Add optional 'to' field for email recipient
}

const MyComponent: FC<Props> = ({ subject, message, to = 'customer@example.com' }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    try {
      await sendEmail({ subject, message, to });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>{subject}</h2>
      <p>{message}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  // Configure your email service provider here (e.g., Gmail, SendGrid, etc.)
});

// Function to send an email using the transporter
const sendEmail = async (props: Props) => {
  try {
    const mailOptions = {
      from: 'your-email@example.com',
      to: props.to,
      subject: props.subject,
      text: props.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default MyComponent;