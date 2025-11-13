import React, { useState, useEffect } from 'react';
import { EmailService } from '../../services/EmailService';

interface Props {
  recipientEmail: string;
  subject: string;
  body: string;
}

interface EmailServiceError {
  message: string;
}

interface PropsWithError {
  recipientEmail: string;
  subject: string;
  body: string;
  error?: EmailServiceError;
}

const MyComponent: React.FC<PropsWithError> = ({ recipientEmail, subject, body, error }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailService, setEmailService] = useState<EmailService | null>(null);

  useEffect(() => {
    const newEmailService = new EmailService();
    setEmailService(newEmailService);
  }, []);

  const handleEmailSend = async () => {
    if (!emailService) return;

    try {
      await emailService.sendEmail(recipientEmail, subject, body);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
      setEmailSent(false);
    }
  };

  return (
    <div>
      {emailSent ? (
        <div>Email sent to {recipientEmail}</div>
      ) : (
        <button onClick={handleEmailSend}>Send Email to {recipientEmail}</button>
      )}
      {error && <div>Error sending email to {recipientEmail}: {error.message}</div>}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { EmailService } from '../../services/EmailService';

interface Props {
  recipientEmail: string;
  subject: string;
  body: string;
}

interface EmailServiceError {
  message: string;
}

interface PropsWithError {
  recipientEmail: string;
  subject: string;
  body: string;
  error?: EmailServiceError;
}

const MyComponent: React.FC<PropsWithError> = ({ recipientEmail, subject, body, error }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailService, setEmailService] = useState<EmailService | null>(null);

  useEffect(() => {
    const newEmailService = new EmailService();
    setEmailService(newEmailService);
  }, []);

  const handleEmailSend = async () => {
    if (!emailService) return;

    try {
      await emailService.sendEmail(recipientEmail, subject, body);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
      setEmailSent(false);
    }
  };

  return (
    <div>
      {emailSent ? (
        <div>Email sent to {recipientEmail}</div>
      ) : (
        <button onClick={handleEmailSend}>Send Email to {recipientEmail}</button>
      )}
      {error && <div>Error sending email to {recipientEmail}: {error.message}</div>}
    </div>
  );
};

export default MyComponent;