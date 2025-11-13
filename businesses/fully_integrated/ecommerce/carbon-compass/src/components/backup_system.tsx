import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDangerouslySetInnerHTML } from 'react-html-sanitizer';

interface Props {
  message: string;
}

const sanitizeHtml = (input: string, allowedTags: string[], allowedAttributes: { [key: string]: string[] }) => {
  const sanitizeOptions = {
    allowedTags,
    allowedAttributes,
    transforms: {
      // Remove script and style tags for security reasons
      removeScript: true,
      removeStyle: true,
      // Remove noscript tag for accessibility
      removeNoscript: true,
      // Remove iframe tag for resiliency and security
      removeIframe: true,
      // Remove form tag for resiliency and security
      removeForm: true,
    },
  };

  return defaultSanitizeHtml(input, sanitizeOptions);
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    const sanitized = sanitizeHtml(message, [
      'div',
      'p',
      'strong',
      'em',
      'a',
    ], {
      a: ['href'],
    });
    setSanitizedMessage(sanitized);
  }, [message]);

  return (
    <div>
      <h1>Backup System Status</h1>
      <p id="accessibility-description">
        This section contains the current status of the backup system.
      </p>
      <div id="status-message" dangerouslySetInnerHTML={sanitizeDangerouslySetInnerHTML({ __html: sanitizedMessage })} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDangerouslySetInnerHTML } from 'react-html-sanitizer';

interface Props {
  message: string;
}

const sanitizeHtml = (input: string, allowedTags: string[], allowedAttributes: { [key: string]: string[] }) => {
  const sanitizeOptions = {
    allowedTags,
    allowedAttributes,
    transforms: {
      // Remove script and style tags for security reasons
      removeScript: true,
      removeStyle: true,
      // Remove noscript tag for accessibility
      removeNoscript: true,
      // Remove iframe tag for resiliency and security
      removeIframe: true,
      // Remove form tag for resiliency and security
      removeForm: true,
    },
  };

  return defaultSanitizeHtml(input, sanitizeOptions);
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    const sanitized = sanitizeHtml(message, [
      'div',
      'p',
      'strong',
      'em',
      'a',
    ], {
      a: ['href'],
    });
    setSanitizedMessage(sanitized);
  }, [message]);

  return (
    <div>
      <h1>Backup System Status</h1>
      <p id="accessibility-description">
        This section contains the current status of the backup system.
      </p>
      <div id="status-message" dangerouslySetInnerHTML={sanitizeDangerouslySetInnerHTML({ __html: sanitizedMessage })} />
    </div>
  );
};

export default MyComponent;