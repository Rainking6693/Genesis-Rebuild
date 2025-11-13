import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDom } from 'sanitize-dom';

interface Props {
  message: string;
  isTrustedContent?: boolean;
}

const sanitizeOptions = (isTrustedContent: boolean) => {
  const baseOptions = {
    allowedTags: ['div', 'p', 'strong', 'em', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
  };

  return isTrustedContent
    ? { ...baseOptions, allowedUnsafeTags: [], allowedUnsafeAttributes: {} }
    : baseOptions;
};

const MyComponent: FC<Props> = ({ message, isTrustedContent = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    setSanitizedMessage(
      sanitizeDom(message, sanitizeOptions(isTrustedContent))
    );
  }, [message, isTrustedContent]);

  return (
    <div>
      <p id="accessibility-label">Backup message:</p>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedMessage,
        }}
      />
      {!isTrustedContent && (
        <p id="accessibility-note">
          This content has been sanitized for security purposes.
        </p>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { sanitize as sanitizeDom } from 'sanitize-dom';

interface Props {
  message: string;
  isTrustedContent?: boolean;
}

const sanitizeOptions = (isTrustedContent: boolean) => {
  const baseOptions = {
    allowedTags: ['div', 'p', 'strong', 'em', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
  };

  return isTrustedContent
    ? { ...baseOptions, allowedUnsafeTags: [], allowedUnsafeAttributes: {} }
    : baseOptions;
};

const MyComponent: FC<Props> = ({ message, isTrustedContent = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    setSanitizedMessage(
      sanitizeDom(message, sanitizeOptions(isTrustedContent))
    );
  }, [message, isTrustedContent]);

  return (
    <div>
      <p id="accessibility-label">Backup message:</p>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedMessage,
        }}
      />
      {!isTrustedContent && (
        <p id="accessibility-note">
          This content has been sanitized for security purposes.
        </p>
      )}
    </div>
  );
};

export default MyComponent;