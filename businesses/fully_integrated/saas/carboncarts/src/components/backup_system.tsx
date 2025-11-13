import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState<ReactNode>(message);

  useEffect(() => {
    try {
      // Sanitize the message using a library like DOMPurify to prevent XSS attacks
      setSafeMessage(DOMPurify.sanitize(message));
    } catch (error) {
      // Log the error and provide a fallback message
      console.error(error);
      setSafeMessage('An error occurred while sanitizing the message. Please contact support.');
    }
  }, [message]);

  // Add a defaultProps for accessibility
  MyComponent.defaultProps = {
    message: '',
  };

  // Use a more accessible div with aria-label
  return <div aria-label="Backup message" dangerouslySetInnerHTML={{ __html: safeMessage }} />;
};

// Ensure proper export
export default React.memo(MyComponent);

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState<ReactNode>(message);

  useEffect(() => {
    try {
      // Sanitize the message using a library like DOMPurify to prevent XSS attacks
      setSafeMessage(DOMPurify.sanitize(message));
    } catch (error) {
      // Log the error and provide a fallback message
      console.error(error);
      setSafeMessage('An error occurred while sanitizing the message. Please contact support.');
    }
  }, [message]);

  // Add a defaultProps for accessibility
  MyComponent.defaultProps = {
    message: '',
  };

  // Use a more accessible div with aria-label
  return <div aria-label="Backup message" dangerouslySetInnerHTML={{ __html: safeMessage }} />;
};

// Ensure proper export
export default React.memo(MyComponent);