import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDom } from 'dompurify';

interface Props {
  message: string;
}

const sanitizeOptions = {
  ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a'],
  ALLOWED_ATTRIBUTES: {
    a: ['href'],
  },
};

const sanitizeHtml = (input: string, options: any) => {
  try {
    return defaultSanitizeHtml(input, options);
  } catch (error) {
    console.error(`Error sanitizing HTML: ${error.message}`);
    return input;
  }
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, sanitizeOptions));
  }, [message]);

  return (
    <div>
      <p id="accessibility-label" aria-describedby="backup-system-message">Backup System Message:</p>
      <div id="backup-system-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDom } from 'dompurify';

interface Props {
  message: string;
}

const sanitizeOptions = {
  ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a'],
  ALLOWED_ATTRIBUTES: {
    a: ['href'],
  },
};

const sanitizeHtml = (input: string, options: any) => {
  try {
    return defaultSanitizeHtml(input, options);
  } catch (error) {
    console.error(`Error sanitizing HTML: ${error.message}`);
    return input;
  }
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, sanitizeOptions));
  }, [message]);

  return (
    <div>
      <p id="accessibility-label" aria-describedby="backup-system-message">Backup System Message:</p>
      <div id="backup-system-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;