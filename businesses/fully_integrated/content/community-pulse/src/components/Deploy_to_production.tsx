import React, { FC, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { isValidURL } from './urlValidator'; // Add this import for the custom URL validator

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ['div', 'p', 'strong', 'em', 'a'],
      allowedAttributes: {
        a: {
          href: (value) => isValidURL(value), // Use custom URL validator
        },
      },
    });

    setSafeMessage(sanitizedMessage);
  }, [message]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <article aria-label="Message" role="article">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </article>
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { isValidURL } from './urlValidator'; // Add this import for the custom URL validator

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ['div', 'p', 'strong', 'em', 'a'],
      allowedAttributes: {
        a: {
          href: (value) => isValidURL(value), // Use custom URL validator
        },
      },
    });

    setSafeMessage(sanitizedMessage);
  }, [message]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <article aria-label="Message" role="article">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </article>
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

export default MyComponent;