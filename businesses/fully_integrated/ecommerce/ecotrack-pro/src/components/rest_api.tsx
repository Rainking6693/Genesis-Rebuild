import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string): string => {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  const sanitizedMessage = DOMPurify.sanitize(message);
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const validatedMessage = validateMessage(event.target.value);
      setError(null);
      // You can use the validatedMessage here.
    } catch (error) {
      setError(error.message);
    }
  };

  // Adding a placeholder for accessibility
  const inputPlaceholder = 'Enter your message';

  // Adding a maxLength property for input to prevent excessive input
  const maxInputLength = 200;

  return (
    <div>
      <input
        type="text"
        placeholder={inputPlaceholder}
        maxLength={maxInputLength}
        onChange={handleMessageChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const validateMessage = (message: string): string => {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  const sanitizedMessage = DOMPurify.sanitize(message);
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const validatedMessage = validateMessage(event.target.value);
      setError(null);
      // You can use the validatedMessage here.
    } catch (error) {
      setError(error.message);
    }
  };

  // Adding a placeholder for accessibility
  const inputPlaceholder = 'Enter your message';

  // Adding a maxLength property for input to prevent excessive input
  const maxInputLength = 200;

  return (
    <div>
      <input
        type="text"
        placeholder={inputPlaceholder}
        maxLength={maxInputLength}
        onChange={handleMessageChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;