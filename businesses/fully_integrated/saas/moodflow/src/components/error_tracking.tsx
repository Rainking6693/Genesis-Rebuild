import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { useLocation } from '@reach/router';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  message: string;
}

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'strong', 'em', 'a'],
  allowedAttributes: {
    a: {
      href: true,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const location = useLocation();

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, sanitizeOptions));
  }, [message]);

  const handleError = (error: Error) => {
    console.error(`Error in ErrorComponent: ${error.message}`);
    // Implement error reporting logic here
  };

  return (
    <ErrorBoundary FallbackComponent={() => <div>An error occurred while rendering the error message.</div>} onError={handleError}>
      <div>
        <div className="error-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <a href={`${location.origin}${location.pathname}#error-report`} className="error-report-link" target="_blank" rel="noopener noreferrer">
          Report this error
        </a>
      </div>
    </ErrorBoundary>
  );
};

const reportError = (message: string) => {
  // Implement error reporting logic here
  console.error(message);
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { useLocation } from '@reach/router';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  message: string;
}

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'strong', 'em', 'a'],
  allowedAttributes: {
    a: {
      href: true,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const location = useLocation();

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, sanitizeOptions));
  }, [message]);

  const handleError = (error: Error) => {
    console.error(`Error in ErrorComponent: ${error.message}`);
    // Implement error reporting logic here
  };

  return (
    <ErrorBoundary FallbackComponent={() => <div>An error occurred while rendering the error message.</div>} onError={handleError}>
      <div>
        <div className="error-message" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <a href={`${location.origin}${location.pathname}#error-report`} className="error-report-link" target="_blank" rel="noopener noreferrer">
          Report this error
        </a>
      </div>
    </ErrorBoundary>
  );
};

const reportError = (message: string) => {
  // Implement error reporting logic here
  console.error(message);
};

export default MyComponent;