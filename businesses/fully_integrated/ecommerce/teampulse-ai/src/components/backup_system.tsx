import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import clipboard from 'clipboard'; // Install this package: npm install clipboard

interface Props {
  message: string;
}

const sanitizeHtml = (input: string, allowedTags: string[], allowedAttributes: { [key: string]: string[] }) => {
  const options = {
    allowedTags,
    allowedAttributes,
  };

  const sanitize = (input: string, options: any) => {
    const defaultOptions = {
      allowedTags: ['div', 'p', 'strong', 'em', 'a'],
      allowedAttributes: {
        a: ['href'],
      },
      allowedClasses: [],
      allowedStyles: {},
    };

    return defaultSanitizeHtml(input, { ...defaultOptions, ...options });
  };

  return sanitize(input, options);
};

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    const allowedTags = ['div', 'p', 'strong', 'em', 'a'];
    const allowedAttributes = {
      a: ['href'],
    };

    setSanitizedMessage(sanitizeHtml(message, allowedTags, allowedAttributes));
  }, [message]);

  const handleCopyClick = () => {
    clipboard.writeText(sanitizedMessage);
  };

  return (
    <div>
      <h1>Backup System Message</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <a href="#" onClick={handleCopyClick}>
        Copy Message
      </a>
      {/* Add ARIA attributes for accessibility */}
      <a href="#" aria-label="Copy message" onClick={handleCopyClick}>
        Copy Message (Keyboard shortcut: Ctrl+C or Cmd+C)
      </a>
    </div>
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default FunctionalComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import clipboard from 'clipboard'; // Install this package: npm install clipboard

interface Props {
  message: string;
}

const sanitizeHtml = (input: string, allowedTags: string[], allowedAttributes: { [key: string]: string[] }) => {
  const options = {
    allowedTags,
    allowedAttributes,
  };

  const sanitize = (input: string, options: any) => {
    const defaultOptions = {
      allowedTags: ['div', 'p', 'strong', 'em', 'a'],
      allowedAttributes: {
        a: ['href'],
      },
      allowedClasses: [],
      allowedStyles: {},
    };

    return defaultSanitizeHtml(input, { ...defaultOptions, ...options });
  };

  return sanitize(input, options);
};

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    const allowedTags = ['div', 'p', 'strong', 'em', 'a'];
    const allowedAttributes = {
      a: ['href'],
    };

    setSanitizedMessage(sanitizeHtml(message, allowedTags, allowedAttributes));
  }, [message]);

  const handleCopyClick = () => {
    clipboard.writeText(sanitizedMessage);
  };

  return (
    <div>
      <h1>Backup System Message</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <a href="#" onClick={handleCopyClick}>
        Copy Message
      </a>
      {/* Add ARIA attributes for accessibility */}
      <a href="#" aria-label="Copy message" onClick={handleCopyClick}>
        Copy Message (Keyboard shortcut: Ctrl+C or Cmd+C)
      </a>
    </div>
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default FunctionalComponent;