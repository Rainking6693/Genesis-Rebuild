import React, { FC, useMemo, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  key?: Key; // Adding a type for the key prop to ensure consistency
}

const SocialMediaMessage: FC<Props> = ({ message, key }) => {
  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Optimize performance by memoizing the component if the message prop doesn't change
  const memoizedMessage = useMemo(() => (
    sanitizedMessage ? (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label="Social media message" // Adding aria-label for accessibility
      />
    ) : null
  ), [sanitizedMessage]);

  return <div {...{ ref, key, ...props }} />;
};

// Set default props to prevent unexpected behavior
SocialMediaMessage.defaultProps = {
  message: '',
  key: '',
};

export default SocialMediaMessage;

import React, { FC, useMemo, Key, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  key?: Key; // Adding a type for the key prop to ensure consistency
}

const SocialMediaMessage: FC<Props> = ({ message, key }) => {
  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Optimize performance by memoizing the component if the message prop doesn't change
  const memoizedMessage = useMemo(() => (
    sanitizedMessage ? (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label="Social media message" // Adding aria-label for accessibility
      />
    ) : null
  ), [sanitizedMessage]);

  return <div {...{ ref, key, ...props }} />;
};

// Set default props to prevent unexpected behavior
SocialMediaMessage.defaultProps = {
  message: '',
  key: '',
};

export default SocialMediaMessage;