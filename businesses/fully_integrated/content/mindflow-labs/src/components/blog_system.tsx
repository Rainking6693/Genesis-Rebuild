import React, { FC, useMemo, useEffect } from 'react';
import Dompurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState('');

  useEffect(() => {
    const sanitized = Dompurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.displayName = 'MyComponent';

/**
 * SanitizeContent is a function that sanitizes user-generated content by removing potentially harmful HTML tags and attributes.
 * It should be used to ensure the safety of user-generated content in MyComponent.
 */
MyComponent.sanitizeContent = (content: string) => Dompurify.sanitize(content);

// Add accessibility considerations by wrapping the component with a div and providing a proper ARIA label
const AccessibleMyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = MyComponent.sanitizeContent(message);

  return (
    <div>
      <div id="my-component" aria-label="My Component">
        <div>{sanitizedMessage}</div>
      </div>
    </div>
  );
};

export default AccessibleMyComponent;

import React, { FC, useMemo, useEffect } from 'react';
import Dompurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState('');

  useEffect(() => {
    const sanitized = Dompurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.displayName = 'MyComponent';

/**
 * SanitizeContent is a function that sanitizes user-generated content by removing potentially harmful HTML tags and attributes.
 * It should be used to ensure the safety of user-generated content in MyComponent.
 */
MyComponent.sanitizeContent = (content: string) => Dompurify.sanitize(content);

// Add accessibility considerations by wrapping the component with a div and providing a proper ARIA label
const AccessibleMyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = MyComponent.sanitizeContent(message);

  return (
    <div>
      <div id="my-component" aria-label="My Component">
        <div>{sanitizedMessage}</div>
      </div>
    </div>
  );
};

export default AccessibleMyComponent;