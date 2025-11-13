import { MoodBoardAIMessage } from './message_types';

export const validateMessage = (message: MoodBoardAIMessage): message is MoodBoardAIMessage => {
  // Add validation logic here
  // For example, check if message has required properties and data types
  // Check if id and text are non-empty strings
  if (!message.id || !message.text) {
    return false;
  }

  // Check if id is unique (if applicable)
  // Check if text is within a reasonable length

  return (
    typeof message.id === 'string' &&
    typeof message.text === 'string'
  );
};

// MyComponent.tsx
import React, { useState, useMemo } from 'react';
import { MoodBoardAIMessage, validateMessage } from './MoodBoardAIMessageValidator';

interface Props {
  message?: MoodBoardAIMessage; // Add default value or nullable type
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const validatedMessage = useMemo(() => {
    if (!message || !validateMessage(message)) {
      setError('Invalid message format');
      return null;
    }

    // Add more specific error messages for each validation check that fails

    return message;
  }, [message]);

  if (!validatedMessage) {
    return <div>Error: {error}</div>;
  }

  return <div>{validatedMessage.text}</div>;
};

export default MyComponent;

import { MoodBoardAIMessage } from './message_types';

export const validateMessage = (message: MoodBoardAIMessage): message is MoodBoardAIMessage => {
  // Add validation logic here
  // For example, check if message has required properties and data types
  // Check if id and text are non-empty strings
  if (!message.id || !message.text) {
    return false;
  }

  // Check if id is unique (if applicable)
  // Check if text is within a reasonable length

  return (
    typeof message.id === 'string' &&
    typeof message.text === 'string'
  );
};

// MyComponent.tsx
import React, { useState, useMemo } from 'react';
import { MoodBoardAIMessage, validateMessage } from './MoodBoardAIMessageValidator';

interface Props {
  message?: MoodBoardAIMessage; // Add default value or nullable type
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);

  const validatedMessage = useMemo(() => {
    if (!message || !validateMessage(message)) {
      setError('Invalid message format');
      return null;
    }

    // Add more specific error messages for each validation check that fails

    return message;
  }, [message]);

  if (!validatedMessage) {
    return <div>Error: {error}</div>;
  }

  return <div>{validatedMessage.text}</div>;
};

export default MyComponent;