import React, { FC, useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((input: string) => {
    try {
      return DOMPurify.sanitize(input);
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return '';
    }
  }, []);

  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message, sanitizeMessage]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage,
      }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

// Optimize performance by memoizing the component if message prop is stable
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;

import React, { FC, useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizeMessage = useCallback((input: string) => {
    try {
      return DOMPurify.sanitize(input);
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return '';
    }
  }, []);

  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message, sanitizeMessage]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage,
      }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

// Optimize performance by memoizing the component if message prop is stable
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;