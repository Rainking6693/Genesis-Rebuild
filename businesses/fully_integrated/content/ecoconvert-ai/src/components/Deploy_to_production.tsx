import React, { FC, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode>(null);

  useEffect(() => {
    if (message) {
      const sanitized = DOMPurify.sanitize(message);
      setSanitizedMessage(sanitized);
    }
  }, [message]);

  // Add a fallback for when the message is empty or invalid
  const fallbackContent: ReactNode = (
    <div>
      {/* Add a screen reader-friendly message for accessibility */}
      <span className="sr-only">
        Error: Invalid or empty message provided
      </span>
      {/* Add a placeholder or default content for the component */}
      <div>Default Content</div>
    </div>
  );

  return sanitizedMessage || fallbackContent;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode>(null);

  useEffect(() => {
    if (message) {
      const sanitized = DOMPurify.sanitize(message);
      setSanitizedMessage(sanitized);
    }
  }, [message]);

  // Add a fallback for when the message is empty or invalid
  const fallbackContent: ReactNode = (
    <div>
      {/* Add a screen reader-friendly message for accessibility */}
      <span className="sr-only">
        Error: Invalid or empty message provided
      </span>
      {/* Add a placeholder or default content for the component */}
      <div>Default Content</div>
    </div>
  );

  return sanitizedMessage || fallbackContent;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;