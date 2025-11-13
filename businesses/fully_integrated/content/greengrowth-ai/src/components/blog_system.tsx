import React, { FC, ReactNode, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeContent = useCallback((content: string): ReactNode => {
    try {
      return DOMPurify.sanitize(content);
    } catch (error) {
      console.error('Error sanitizing content:', error);
      return 'Invalid HTML';
    }
  }, []);

  const sanitizedContent = sanitizeContent(message);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      aria-label={message}
      role="presentation" // Hide the element from screen readers
    >
      {sanitizedContent || 'Invalid content'}
    </div>
  );
};

MyComponent.sanitizeContent = sanitizeContent;

export default MyComponent;

import React, { FC, ReactNode, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeContent = useCallback((content: string): ReactNode => {
    try {
      return DOMPurify.sanitize(content);
    } catch (error) {
      console.error('Error sanitizing content:', error);
      return 'Invalid HTML';
    }
  }, []);

  const sanitizedContent = sanitizeContent(message);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      aria-label={message}
      role="presentation" // Hide the element from screen readers
    >
      {sanitizedContent || 'Invalid content'}
    </div>
  );
};

MyComponent.sanitizeContent = sanitizeContent;

export default MyComponent;