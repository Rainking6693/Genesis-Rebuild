import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  subject?: string;
  from?: string;
  to?: string;
  body?: string;
}

const MyEmailComponent: React.FC<Props> = ({ subject, from, to, body }) => {
  const [error, setError] = useState<string | null>(null);

  // Add default values for optional props
  const defaultProps: Props = {
    subject: '',
    from: '',
    to: '',
    body: '',
  };

  // Spread defaultProps to ensure all props are present
  const props = { ...defaultProps, ...{ subject, from, to, body } };

  // Validate required props
  if (!props.subject || !props.from || !props.to || !props.body) {
    setError('All props (subject, from, to, body) are required.');
    return null;
  }

  // Validate email address in the to property
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(props.to)) {
    setError('Invalid email address in the to property.');
    return null;
  }

  // Sanitize input data to prevent XSS attacks
  const sanitizedSubject = DOMPurify.sanitize(props.subject);
  const sanitizedFrom = DOMPurify.sanitize(props.from);
  const sanitizedTo = DOMPurify.sanitize(props.to);
  const sanitizedBody = DOMPurify.sanitize(props.body);

  // Optimize performance by memoizing the component if props don't change
  const memoizedComponent = useMemo(() => (
    <div role="presentation">
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <h1 aria-level="1" title={sanitizedSubject}>Subject: {sanitizedSubject}</h1>
          <h2 aria-level="2" title={sanitizedFrom}>From: {sanitizedFrom}</h2>
          <h2 aria-level="2" title={sanitizedTo}>To: {sanitizedTo}</h2>
          <a href={`mailto:${sanitizedTo}?subject=${sanitizedSubject}&body=${sanitizedBody}`} rel="noReply">Reply</a>
          <p dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
        </body>
      </html>
    </div>
  ), [sanitizedSubject, sanitizedFrom, sanitizedTo, sanitizedBody]);

  return (
    <>
      {error && <div role="alert">{error}</div>}
      {memoizedComponent}
    </>
  );
};

export default MyEmailComponent;

import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  subject?: string;
  from?: string;
  to?: string;
  body?: string;
}

const MyEmailComponent: React.FC<Props> = ({ subject, from, to, body }) => {
  const [error, setError] = useState<string | null>(null);

  // Add default values for optional props
  const defaultProps: Props = {
    subject: '',
    from: '',
    to: '',
    body: '',
  };

  // Spread defaultProps to ensure all props are present
  const props = { ...defaultProps, ...{ subject, from, to, body } };

  // Validate required props
  if (!props.subject || !props.from || !props.to || !props.body) {
    setError('All props (subject, from, to, body) are required.');
    return null;
  }

  // Validate email address in the to property
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(props.to)) {
    setError('Invalid email address in the to property.');
    return null;
  }

  // Sanitize input data to prevent XSS attacks
  const sanitizedSubject = DOMPurify.sanitize(props.subject);
  const sanitizedFrom = DOMPurify.sanitize(props.from);
  const sanitizedTo = DOMPurify.sanitize(props.to);
  const sanitizedBody = DOMPurify.sanitize(props.body);

  // Optimize performance by memoizing the component if props don't change
  const memoizedComponent = useMemo(() => (
    <div role="presentation">
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <h1 aria-level="1" title={sanitizedSubject}>Subject: {sanitizedSubject}</h1>
          <h2 aria-level="2" title={sanitizedFrom}>From: {sanitizedFrom}</h2>
          <h2 aria-level="2" title={sanitizedTo}>To: {sanitizedTo}</h2>
          <a href={`mailto:${sanitizedTo}?subject=${sanitizedSubject}&body=${sanitizedBody}`} rel="noReply">Reply</a>
          <p dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
        </body>
      </html>
    </div>
  ), [sanitizedSubject, sanitizedFrom, sanitizedTo, sanitizedBody]);

  return (
    <>
      {error && <div role="alert">{error}</div>}
      {memoizedComponent}
    </>
  );
};

export default MyEmailComponent;