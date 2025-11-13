import React, { FC, forwardRef, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { SanitizeHtmlOptions } from 'sanitize-html';

type SanitizeHtmlFunction = (html: string, options?: SanitizeHtmlOptions) => string;

interface Props {
  message: string;
  ariaLabel?: string;
  sanitizeHtmlFunction?: SanitizeHtmlFunction;
}

const defaultSanitizeHtmlOptions: SanitizeHtmlOptions = {
  allowedTags: ['p', 'strong', 'em', 'a', 'br', 'span'],
  allowedAttributes: {
    a: ['href'],
    span: ['class'],
  },
};

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ariaLabel, sanitizeHtmlFunction }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message || 'No report message');

  useEffect(() => {
    let options = defaultSanitizeHtmlOptions;

    if (sanitizeHtmlFunction) {
      options = { ...defaultSanitizeHtmlOptions, ...{ allowedTags: sanitizeHtmlFunction.allowedTags, allowedAttributes: sanitizeHtmlFunction.allowedAttributes } };
    }

    setSanitizedMessage(sanitizeHtmlFunction ? sanitizeHtmlFunction(message || '', options) : defaultSanitizeHtml(message || '', defaultSanitizeHtmlOptions));
  }, [message, sanitizeHtmlFunction]);

  return (
    <div ref={ref} className="report-message" aria-label={ariaLabel}>
      {sanitizedMessage}
    </div>
  );
});

export default MyComponent;

import React, { FC, forwardRef, useEffect, useState } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'sanitize-html';
import { SanitizeHtmlOptions } from 'sanitize-html';

type SanitizeHtmlFunction = (html: string, options?: SanitizeHtmlOptions) => string;

interface Props {
  message: string;
  ariaLabel?: string;
  sanitizeHtmlFunction?: SanitizeHtmlFunction;
}

const defaultSanitizeHtmlOptions: SanitizeHtmlOptions = {
  allowedTags: ['p', 'strong', 'em', 'a', 'br', 'span'],
  allowedAttributes: {
    a: ['href'],
    span: ['class'],
  },
};

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ariaLabel, sanitizeHtmlFunction }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(message || 'No report message');

  useEffect(() => {
    let options = defaultSanitizeHtmlOptions;

    if (sanitizeHtmlFunction) {
      options = { ...defaultSanitizeHtmlOptions, ...{ allowedTags: sanitizeHtmlFunction.allowedTags, allowedAttributes: sanitizeHtmlFunction.allowedAttributes } };
    }

    setSanitizedMessage(sanitizeHtmlFunction ? sanitizeHtmlFunction(message || '', options) : defaultSanitizeHtml(message || '', defaultSanitizeHtmlOptions));
  }, [message, sanitizeHtmlFunction]);

  return (
    <div ref={ref} className="report-message" aria-label={ariaLabel}>
      {sanitizedMessage}
    </div>
  );
});

export default MyComponent;