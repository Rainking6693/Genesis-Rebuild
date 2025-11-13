import React, { useState, useEffect } from 'react';
import { EMAIL_TEMPLATE_ID, EMAIL_SEND_ERROR } from '../../constants';
import { sendEmail, handleEmailSendError } from '../../services/emailService';

interface Props {
  recipientEmail: string;
  subject: string;
  body: string;
}

const MyComponent: React.FC<Props> = ({ recipientEmail, subject, body }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSending && !loading) {
      setLoading(true);
      handleSendEmail();
    }
  }, [isSending, loading]);

  const handleSendEmail = async () => {
    if (!recipientEmail || !subject || !body) {
      setError('Please provide a valid recipient email, subject, and body.');
      return;
    }

    setIsSending(true);
    try {
      await sendEmail({ recipientEmail, subject, body, templateId: EMAIL_TEMPLATE_ID });
      setIsSending(false);
      setError(null);
      setLoading(false);
    } catch (error) {
      setIsSending(false);
      handleEmailSendError(error);
      setError(EMAIL_SEND_ERROR);
      setTimeout(() => setError(null), 5000); // Hide error message after 5 seconds
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedHandleSendEmail = debounce(handleSendEmail, 500);

  return (
    <div>
      <button aria-label="Send Email" disabled={isSending || loading} onClick={debouncedHandleSendEmail}>
        {isSending ? 'Sending Email...' : 'Send Email'}
      </button>
      {error && <p aria-live="polite" style={{ color: 'red' }}>{error}</p>}
      {body}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { EMAIL_TEMPLATE_ID, EMAIL_SEND_ERROR } from '../../constants';
import { sendEmail, handleEmailSendError } from '../../services/emailService';

interface Props {
  recipientEmail: string;
  subject: string;
  body: string;
}

const MyComponent: React.FC<Props> = ({ recipientEmail, subject, body }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSending && !loading) {
      setLoading(true);
      handleSendEmail();
    }
  }, [isSending, loading]);

  const handleSendEmail = async () => {
    if (!recipientEmail || !subject || !body) {
      setError('Please provide a valid recipient email, subject, and body.');
      return;
    }

    setIsSending(true);
    try {
      await sendEmail({ recipientEmail, subject, body, templateId: EMAIL_TEMPLATE_ID });
      setIsSending(false);
      setError(null);
      setLoading(false);
    } catch (error) {
      setIsSending(false);
      handleEmailSendError(error);
      setError(EMAIL_SEND_ERROR);
      setTimeout(() => setError(null), 5000); // Hide error message after 5 seconds
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedHandleSendEmail = debounce(handleSendEmail, 500);

  return (
    <div>
      <button aria-label="Send Email" disabled={isSending || loading} onClick={debouncedHandleSendEmail}>
        {isSending ? 'Sending Email...' : 'Send Email'}
      </button>
      {error && <p aria-live="polite" style={{ color: 'red' }}>{error}</p>}
      {body}
    </div>
  );
};

export default MyComponent;