import React, { useEffect, useState } from 'react';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface Props {
  recipientEmail: string;
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ recipientEmail, subject, message }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const validateEmail = (email: string) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    if (!validateEmail(recipientEmail)) {
      setError(new Error('Invalid recipient email'));
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text: message,
    };

    setSending(true);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        setError(error);
      } else {
        setSending(false);
        console.log(`Email sent: ${info.response}`);
      }
    });
  }, [recipientEmail, subject, message]);

  return (
    <div>
      {sending ? (
        <div>Email sending in progress...</div>
      ) : (
        <>
          {error && <div>Error: {error.message}</div>}
          {!error && <div>Email sent successfully!</div>}
        </>
      )}
    </div>
  );
};

export default FunctionalComponent;

import React, { useEffect, useState } from 'react';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface Props {
  recipientEmail: string;
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ recipientEmail, subject, message }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const validateEmail = (email: string) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    if (!validateEmail(recipientEmail)) {
      setError(new Error('Invalid recipient email'));
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text: message,
    };

    setSending(true);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        setError(error);
      } else {
        setSending(false);
        console.log(`Email sent: ${info.response}`);
      }
    });
  }, [recipientEmail, subject, message]);

  return (
    <div>
      {sending ? (
        <div>Email sending in progress...</div>
      ) : (
        <>
          {error && <div>Error: {error.message}</div>}
          {!error && <div>Email sent successfully!</div>}
        </>
      )}
    </div>
  );
};

export default FunctionalComponent;