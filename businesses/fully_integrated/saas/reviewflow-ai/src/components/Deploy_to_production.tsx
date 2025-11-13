import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const sanitizedMessage = DOMPurify.sanitize(message);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    if (validateMessage(inputMessage)) {
      setError(null);
    } else {
      setError('Invalid or empty message');
    }
  };

  return (
    <div>
      <input type="text" value={message} onChange={handleMessageChange} />
      {error && <div>{error}</div>}
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

// Add error handling and validation for message input
const validateMessage = (message: string) => {
  try {
    const sanitizedMessage = DOMPurify.sanitize(message);
    if (!sanitizedMessage) {
      throw new Error('Invalid or empty message');
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default MyComponent;

import React, { FC, ReactNode, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const sanitizedMessage = DOMPurify.sanitize(message);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    if (validateMessage(inputMessage)) {
      setError(null);
    } else {
      setError('Invalid or empty message');
    }
  };

  return (
    <div>
      <input type="text" value={message} onChange={handleMessageChange} />
      {error && <div>{error}</div>}
      {sanitizedMessage && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
    </div>
  );
};

// Add error handling and validation for message input
const validateMessage = (message: string) => {
  try {
    const sanitizedMessage = DOMPurify.sanitize(message);
    if (!sanitizedMessage) {
      throw new Error('Invalid or empty message');
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default MyComponent;