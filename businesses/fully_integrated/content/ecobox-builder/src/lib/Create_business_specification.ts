import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string) => {
  // Implement validation logic here, such as checking for XSS attacks
  // You can use libraries like DOMPurify for sanitizing user input
  const sanitizedMessage = DOMPurify.sanitize(message);
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputMessage = event.target.value;
    const validatedMessage = validateMessage(inputMessage);
    setError(inputMessage !== validatedMessage ? 'Invalid input. Please use plain text.' : null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent pasting HTML or scripts
    if (event.key === 'v' && event.clipboardData) {
      event.clipboardData.items.forEach((item) => {
        if (item.type.indexOf('text/html') !== -1) {
          event.preventDefault();
        }
      });
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your message"
        aria-describedby="message-error"
      />
      {error && <p id="message-error">{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <style jsx>{`
        textarea {
          resize: vertical;
        }
      `}</style>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

// Use a named export for better readability and maintainability
export const EcoBoxBuilderComponent = MyComponent;

import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string) => {
  // Implement validation logic here, such as checking for XSS attacks
  // You can use libraries like DOMPurify for sanitizing user input
  const sanitizedMessage = DOMPurify.sanitize(message);
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputMessage = event.target.value;
    const validatedMessage = validateMessage(inputMessage);
    setError(inputMessage !== validatedMessage ? 'Invalid input. Please use plain text.' : null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent pasting HTML or scripts
    if (event.key === 'v' && event.clipboardData) {
      event.clipboardData.items.forEach((item) => {
        if (item.type.indexOf('text/html') !== -1) {
          event.preventDefault();
        }
      });
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your message"
        aria-describedby="message-error"
      />
      {error && <p id="message-error">{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <style jsx>{`
        textarea {
          resize: vertical;
        }
      `}</style>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

// Use a named export for better readability and maintainability
export const EcoBoxBuilderComponent = MyComponent;