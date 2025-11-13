import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const sanitizeHtml = (html: string) => {
  // Use DOMPurify library to sanitize the HTML input
  return DOMPurify.sanitize(html);
};

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message));
  }, [message]);

  if (!sanitizedMessage) {
    return <div data-testid="error-message">Error: Invalid HTML input</div>;
  }

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={sanitizedMessage}
        aria-describedby="error-message" // Associate the error message with the sanitized message for screen readers
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const sanitizeHtml = (html: string) => {
  // Use DOMPurify library to sanitize the HTML input
  return DOMPurify.sanitize(html);
};

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message));
  }, [message]);

  if (!sanitizedMessage) {
    return <div data-testid="error-message">Error: Invalid HTML input</div>;
  }

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={sanitizedMessage}
        aria-describedby="error-message" // Associate the error message with the sanitized message for screen readers
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;