import React, { FC, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

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
          href: true,
          target: '_blank', // Open links in a new tab for safety
          rel: 'noopener noreferrer', // Prevent potential issues with parent window
        },
      },
    });

    setSafeMessage(sanitizedMessage);
  }, [message]);

  return (
    <div>
      {/* Use Fragment instead of div for better performance */}
      <React.Fragment>
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
        {/* Add ARIA attributes for accessibility */}
        <div aria-label={safeMessage} />
        {/* Add ARIA-describedby for better accessibility */}
        <div id="message-description">{safeMessage}</div>
      </React.Fragment>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

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
          href: true,
          target: '_blank', // Open links in a new tab for safety
          rel: 'noopener noreferrer', // Prevent potential issues with parent window
        },
      },
    });

    setSafeMessage(sanitizedMessage);
  }, [message]);

  return (
    <div>
      {/* Use Fragment instead of div for better performance */}
      <React.Fragment>
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
        {/* Add ARIA attributes for accessibility */}
        <div aria-label={safeMessage} />
        {/* Add ARIA-describedby for better accessibility */}
        <div id="message-description">{safeMessage}</div>
      </React.Fragment>
    </div>
  );
};

export default MyComponent;