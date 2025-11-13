import { ReactElement, SyntheticEvent, useState } from 'react';
import { sanitizeHtml } from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string): string => {
  // Implement validation logic here, for example:
  // - Trim whitespace
  // - Limit character count
  // - Check for specific patterns or forbidden words
  // - Add error handling for invalid messages
  const errorMessage = 'Message must be between 1 and 255 characters and not contain any forbidden words.';
  if (message.length < 1 || message.length > 255) {
    throw new Error(errorMessage);
  }

  // You can add more checks here

  return message.trim();
};

const sanitize = (unsafeHtml: string): string => {
  // Sanitize the HTML to prevent XSS attacks
  const sanitizer = new DOMPurify();
  return sanitizer.sanitize(unsafeHtml);
};

const MyComponent: React.FC<Props> = ({ message }: Props): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const sanitizedMessage = sanitize(message);

  const handleInputChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    try {
      const validatedMessage = validateMessage(inputValue);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={handleInputChange}
        // Add aria-describedby for accessibility
        aria-describedby={error ? 'error-message' : undefined}
      />
      {error && <p id="error-message">{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;

import { ReactElement, SyntheticEvent, useState } from 'react';
import { sanitizeHtml } from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string): string => {
  // Implement validation logic here, for example:
  // - Trim whitespace
  // - Limit character count
  // - Check for specific patterns or forbidden words
  // - Add error handling for invalid messages
  const errorMessage = 'Message must be between 1 and 255 characters and not contain any forbidden words.';
  if (message.length < 1 || message.length > 255) {
    throw new Error(errorMessage);
  }

  // You can add more checks here

  return message.trim();
};

const sanitize = (unsafeHtml: string): string => {
  // Sanitize the HTML to prevent XSS attacks
  const sanitizer = new DOMPurify();
  return sanitizer.sanitize(unsafeHtml);
};

const MyComponent: React.FC<Props> = ({ message }: Props): ReactElement => {
  const [error, setError] = useState<string | null>(null);
  const sanitizedMessage = sanitize(message);

  const handleInputChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    try {
      const validatedMessage = validateMessage(inputValue);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={handleInputChange}
        // Add aria-describedby for accessibility
        aria-describedby={error ? 'error-message' : undefined}
      />
      {error && <p id="error-message">{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;