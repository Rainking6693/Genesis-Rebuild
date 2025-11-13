import React, { FC, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';

type Email = string;
type Props = {
  subject?: string;
  from?: Email;
  to?: Email;
  message?: string;
  subjectPlaceholder?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  messagePlaceholder?: string;
};

const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const generateUniqueId = () => Math.random().toString(36).substring(7);

const MyComponent: FC<Props> = ({
  subject = '',
  from = process.env.SENDER_EMAIL || '',
  to = '',
  message = '',
  subjectPlaceholder = 'Email Subject',
  fromPlaceholder = 'Your Email',
  toPlaceholder = 'Recipient Email',
  messagePlaceholder = 'Email Message',
}) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(message, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTRS: {},
    });
    // Handle empty or null sanitized message
    return sanitized || messagePlaceholder;
  }, [message]);

  // Validate the email address
  const isValidToEmail = validateEmail(to);

  // Generate a unique ID for the component
  const uniqueId = generateUniqueId();

  return (
    <div>
      {/* Add ARIA labels for accessibility */}
      <div aria-label={`Email Subject: ${subjectPlaceholder}`}>
        {subject || '(Empty)'}{' '}
        {subject.length === 0 && <span aria-hidden="true">*</span>}
      </div>
      <div aria-label={`Your Email: ${fromPlaceholder}`}>{from}</div>
      <div aria-label={`Recipient Email: ${toPlaceholder}`}>
        {isValidToEmail ? to : `(Invalid email: ${to})`}
      </div>
      <div id={uniqueId} ref={sanitizedMessageRef}></div>
      {sanitizedMessage && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedMessage,
            noHtml: true,
          }}
        />
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';

type Email = string;
type Props = {
  subject?: string;
  from?: Email;
  to?: Email;
  message?: string;
  subjectPlaceholder?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  messagePlaceholder?: string;
};

const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const generateUniqueId = () => Math.random().toString(36).substring(7);

const MyComponent: FC<Props> = ({
  subject = '',
  from = process.env.SENDER_EMAIL || '',
  to = '',
  message = '',
  subjectPlaceholder = 'Email Subject',
  fromPlaceholder = 'Your Email',
  toPlaceholder = 'Recipient Email',
  messagePlaceholder = 'Email Message',
}) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(message, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTRS: {},
    });
    // Handle empty or null sanitized message
    return sanitized || messagePlaceholder;
  }, [message]);

  // Validate the email address
  const isValidToEmail = validateEmail(to);

  // Generate a unique ID for the component
  const uniqueId = generateUniqueId();

  return (
    <div>
      {/* Add ARIA labels for accessibility */}
      <div aria-label={`Email Subject: ${subjectPlaceholder}`}>
        {subject || '(Empty)'}{' '}
        {subject.length === 0 && <span aria-hidden="true">*</span>}
      </div>
      <div aria-label={`Your Email: ${fromPlaceholder}`}>{from}</div>
      <div aria-label={`Recipient Email: ${toPlaceholder}`}>
        {isValidToEmail ? to : `(Invalid email: ${to})`}
      </div>
      <div id={uniqueId} ref={sanitizedMessageRef}></div>
      {sanitizedMessage && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedMessage,
            noHtml: true,
          }}
        />
      )}
    </div>
  );
};

export default MyComponent;