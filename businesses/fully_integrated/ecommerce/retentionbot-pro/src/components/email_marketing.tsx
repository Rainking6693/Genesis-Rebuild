import React, { FC, useState, useEffect } from 'react';
import nodemailer from 'nodemailer';
import { transporter } from './email_transporter';

interface Props extends EmailConfig {
  subject: string;
  previewText: string;
  body: string;
  failSilently?: boolean;
  fallbackText?: string;
}

const FunctionalComponent: FC<Props> = ({ subject, previewText, body, from, to, failSilently = false, fallbackText }) => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const mailOptions = {
        from,
        to,
        subject,
        text: previewText,
        html: body
      };

      await transporter.sendMail(mailOptions);
      setLoading(false);
      setHasError(false);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      if (!failSilently) {
        handleError(error);
      }
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    alert(`Error sending email: ${error.message}`);
  };

  const validateEmailConfig = (emailConfig: Props) => {
    if (!emailConfig.from || !emailConfig.to) {
      throw new Error('Missing required email configuration properties: from and to');
    }
  };

  useEffect(() => {
    validateEmailConfig({ ...props, loading, hasError });
    handleSend();
  }, []);

  const renderEmail = () => {
    if (loading) {
      return <div>Sending email...</div>;
    }

    if (hasError) {
      return <div>Error sending email. Please try again later.</div>;
    }

    return (
      <div>
        <h2>{subject}</h2>
        <p>{previewText}</p>
        <p dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    );
  };

  const renderError = () => {
    if (hasError && !failSilently) {
      return <div>Error sending email. Please try again later.</div>;
    }

    return null;
  };

  const renderLoading = () => {
    if (loading) {
      return <div>Sending email...</div>;
    }

    return null;
  };

  const renderFallback = () => {
    if (!loading && hasError) {
      return <div>{fallbackText || 'Unable to send email. Please contact support.'}</div>;
    }

    return null;
  };

  return (
    <div>
      {renderEmail()}
      {renderError()}
      {renderLoading()}
      {renderFallback()}
    </div>
  );
};

export default FunctionalComponent;

import React, { FC, useState, useEffect } from 'react';
import nodemailer from 'nodemailer';
import { transporter } from './email_transporter';

interface Props extends EmailConfig {
  subject: string;
  previewText: string;
  body: string;
  failSilently?: boolean;
  fallbackText?: string;
}

const FunctionalComponent: FC<Props> = ({ subject, previewText, body, from, to, failSilently = false, fallbackText }) => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const mailOptions = {
        from,
        to,
        subject,
        text: previewText,
        html: body
      };

      await transporter.sendMail(mailOptions);
      setLoading(false);
      setHasError(false);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      if (!failSilently) {
        handleError(error);
      }
    }
  };

  const handleError = (error: Error) => {
    console.error(error);
    alert(`Error sending email: ${error.message}`);
  };

  const validateEmailConfig = (emailConfig: Props) => {
    if (!emailConfig.from || !emailConfig.to) {
      throw new Error('Missing required email configuration properties: from and to');
    }
  };

  useEffect(() => {
    validateEmailConfig({ ...props, loading, hasError });
    handleSend();
  }, []);

  const renderEmail = () => {
    if (loading) {
      return <div>Sending email...</div>;
    }

    if (hasError) {
      return <div>Error sending email. Please try again later.</div>;
    }

    return (
      <div>
        <h2>{subject}</h2>
        <p>{previewText}</p>
        <p dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    );
  };

  const renderError = () => {
    if (hasError && !failSilently) {
      return <div>Error sending email. Please try again later.</div>;
    }

    return null;
  };

  const renderLoading = () => {
    if (loading) {
      return <div>Sending email...</div>;
    }

    return null;
  };

  const renderFallback = () => {
    if (!loading && hasError) {
      return <div>{fallbackText || 'Unable to send email. Please contact support.'}</div>;
    }

    return null;
  };

  return (
    <div>
      {renderEmail()}
      {renderError()}
      {renderLoading()}
      {renderFallback()}
    </div>
  );
};

export default FunctionalComponent;