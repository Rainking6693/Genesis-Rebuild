import React, { PropsWithChildren, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogMessageProps {
  message: string;
  isTrusted?: boolean;
  className?: string;
}

const AuditLogMessage: React.FC<PropsWithChildren<AuditLogMessageProps>> = ({ message, isTrusted = false, className }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  React.useEffect(() => {
    if (!isTrusted) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [message, isTrusted]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default AuditLogMessage;

import React, { PropsWithChildren, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  isTrusted?: boolean;
}

const AuditLogMessage: React.FC<PropsWithChildren<AuditLogMessageProps>> = ({ message, isTrusted = false, className, ...rest }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  React.useEffect(() => {
    if (!isTrusted) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [message, isTrusted]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />
  );
};

export default AuditLogMessage;

import React, { PropsWithChildren, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogMessageProps {
  message: string;
  isTrusted?: boolean;
  className?: string;
}

const AuditLogMessage: React.FC<PropsWithChildren<AuditLogMessageProps>> = ({ message, isTrusted = false, className }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  React.useEffect(() => {
    if (!isTrusted) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [message, isTrusted]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default AuditLogMessage;

import React, { PropsWithChildren, useState } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  isTrusted?: boolean;
}

const AuditLogMessage: React.FC<PropsWithChildren<AuditLogMessageProps>> = ({ message, isTrusted = false, className, ...rest }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  React.useEffect(() => {
    if (!isTrusted) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } else {
      setSanitizedMessage(message);
    }
  }, [message, isTrusted]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />
  );
};

export default AuditLogMessage;

<AuditLogMessage message="Your message here" aria-label="Audit log message" />

Improvements made:

1. Added a `className` prop for styling flexibility.
2. Used the `useState` hook to handle the sanitized message state, ensuring that the component re-renders when the `message` or `isTrusted` props change.
3. Moved the sanitization logic into a `useEffect` hook to avoid potential performance issues.
4. Added a check for `isTrusted` before sanitizing the message to improve performance when the message is trusted.
5. Used the `DOMPurify` library for safe HTML sanitization.
6. Added a type for the `className` prop.

For accessibility, consider adding ARIA attributes to the component for better screen reader support. For example:

In this updated code, the `AuditLogMessage` component accepts any additional HTML attributes as props, which can be used to add ARIA attributes for accessibility. For example: