import React, { FC, useEffect, useState } from 'react';
import nodemailer from 'nodemailer';

interface Transporter {
  sendMail: (options: nodemailer.SendMailOptions) => Promise<void>;
}

interface Props {
  transporter: Transporter;
  subject: string;
  message: string;
  recipientEmail?: string; // Added optional recipient email for edge cases
}

const MyComponent: FC<Props> = ({ transporter, subject, message, recipientEmail = 'recipient@example.com' }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sendEmail = async () => {
      try {
        const mailOptions = {
          from: 'ExpenseBot Pro <noreply@expensebotpro.com>',
          to: recipientEmail,
          subject,
          text: message,
        };

        await transporter.sendMail(mailOptions);
      } catch (error) {
        setError(error);
      }
    };

    sendEmail();
  }, [transporter, subject, message, recipientEmail]);

  return (
    <div>
      <h3>{subject}</h3>
      <p>{message}</p>
      {error && <p>Error: {error.message}</p>}
      {!error && <p>Email sent successfully!</p>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import nodemailer from 'nodemailer';

interface Transporter {
  sendMail: (options: nodemailer.SendMailOptions) => Promise<void>;
}

interface Props {
  transporter: Transporter;
  subject: string;
  message: string;
  recipientEmail?: string; // Added optional recipient email for edge cases
}

const MyComponent: FC<Props> = ({ transporter, subject, message, recipientEmail = 'recipient@example.com' }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sendEmail = async () => {
      try {
        const mailOptions = {
          from: 'ExpenseBot Pro <noreply@expensebotpro.com>',
          to: recipientEmail,
          subject,
          text: message,
        };

        await transporter.sendMail(mailOptions);
      } catch (error) {
        setError(error);
      }
    };

    sendEmail();
  }, [transporter, subject, message, recipientEmail]);

  return (
    <div>
      <h3>{subject}</h3>
      <p>{message}</p>
      {error && <p>Error: {error.message}</p>}
      {!error && <p>Email sent successfully!</p>}
    </div>
  );
};

export default MyComponent;