import React, { FC, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  title: string; // Add title for better structure and accessibility
  message: string;
  // Add a default value for message to handle edge cases
  messageDefaultValue?: string;
}

const MyComponent: FC<Props> = ({ title, message, messageDefaultValue = '' }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(messageDefaultValue);

  const handleMessageChange = (newMessage: string) => {
    // Sanitize user input to prevent XSS attacks (security best practice)
    setSanitizedMessage(DOMPurify.sanitize(newMessage));
  };

  const sanitizedMessageMemo = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  return (
    <div>
      <h2>{title}</h2>
      {/* Add a textarea for user input and handle changes to update the sanitizedMessage state */}
      <textarea value={sanitizedMessage} onChange={(e) => handleMessageChange(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessageMemo }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  title: string; // Add title for better structure and accessibility
  message: string;
  // Add a default value for message to handle edge cases
  messageDefaultValue?: string;
}

const MyComponent: FC<Props> = ({ title, message, messageDefaultValue = '' }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(messageDefaultValue);

  const handleMessageChange = (newMessage: string) => {
    // Sanitize user input to prevent XSS attacks (security best practice)
    setSanitizedMessage(DOMPurify.sanitize(newMessage));
  };

  const sanitizedMessageMemo = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  return (
    <div>
      <h2>{title}</h2>
      {/* Add a textarea for user input and handle changes to update the sanitizedMessage state */}
      <textarea value={sanitizedMessage} onChange={(e) => handleMessageChange(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessageMemo }} />
    </div>
  );
};

export default MyComponent;