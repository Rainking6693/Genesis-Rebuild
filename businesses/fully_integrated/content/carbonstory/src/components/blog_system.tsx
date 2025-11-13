import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitization';

type SanitizedMessage = React.ReactNode;
type Props = {
  message: string;
};

const sanitizeUserInput = (message: string): SanitizedMessage => {
  if (!message) return null;

  // Your sanitization logic here
  // Add checks for edge cases, e.g., null or empty input, invalid characters, etc.
  // For example, let's add a check for invalid characters:
  const invalidChars = new RegExp(/[&<>"'`=\/\\]/);
  if (invalidChars.test(message)) {
    throw new Error('Invalid characters found in the input');
  }

  return message;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message));

  // Add accessibility improvements, e.g., adding aria-label or aria-describedby
  const [ariaLabel, setAriaLabel] = useState('HTML content');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = event.target.value;
    setSanitizedMessage(sanitizeUserInput(newMessage));
    setAriaLabel(`HTML content for "${newMessage}"`);
  };

  return (
    <div>
      <label htmlFor="message-input">Message:</label>
      <input id="message-input" value={message} onChange={handleMessageChange} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
      {/* Add additional accessibility elements as needed */}
    </div>
  );
};

// Optimize performance by memoizing the component if the message prop doesn't change
const MemoizedMyComponent = useMemo(() => React.memo(MyComponent), []);

export default MemoizedMyComponent;

import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitization';

type SanitizedMessage = React.ReactNode;
type Props = {
  message: string;
};

const sanitizeUserInput = (message: string): SanitizedMessage => {
  if (!message) return null;

  // Your sanitization logic here
  // Add checks for edge cases, e.g., null or empty input, invalid characters, etc.
  // For example, let's add a check for invalid characters:
  const invalidChars = new RegExp(/[&<>"'`=\/\\]/);
  if (invalidChars.test(message)) {
    throw new Error('Invalid characters found in the input');
  }

  return message;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message));

  // Add accessibility improvements, e.g., adding aria-label or aria-describedby
  const [ariaLabel, setAriaLabel] = useState('HTML content');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = event.target.value;
    setSanitizedMessage(sanitizeUserInput(newMessage));
    setAriaLabel(`HTML content for "${newMessage}"`);
  };

  return (
    <div>
      <label htmlFor="message-input">Message:</label>
      <input id="message-input" value={message} onChange={handleMessageChange} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={ariaLabel} />
      {/* Add additional accessibility elements as needed */}
    </div>
  );
};

// Optimize performance by memoizing the component if the message prop doesn't change
const MemoizedMyComponent = useMemo(() => React.memo(MyComponent), []);

export default MemoizedMyComponent;