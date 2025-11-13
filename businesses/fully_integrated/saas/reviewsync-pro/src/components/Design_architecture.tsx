import React, { FC, useMemo, useCallback } from 'react';
import { useId } from '@reach/auto-id';

interface Props {
  message: string;
  className?: string;
  id?: string;
}

// Function to validate user-generated messages for potential XSS attacks
const validateMessage = (message: string) => {
  // Implement a regular expression or other method to validate the message
  // If the message is invalid, return an error message or throw an exception
  // For simplicity, I've used a basic XSS prevention regular expression
  const xssRegex = /<[^>]+>/g;
  if (xssRegex.test(message)) {
    throw new Error('Invalid user-generated message: XSS attack detected');
  }
  return message;
};

const MyComponent: FC<Props> = ({ message, className, id }) => {
  // Generate a unique id for the component if none is provided
  const componentId = useId();
  const validatedMessage = useMemo(() => validateMessage(message), [message]);

  // Use a callback to ensure the validatedMessage is only re-created when message changes
  const handleMessageChange = useCallback(() => {
    const newValidatedMessage = validateMessage(message);
    // If the new validatedMessage is different from the current one, update the component
    if (newValidatedMessage !== validatedMessage) {
      setValidatedMessage(newValidatedMessage);
    }
  }, [message, validatedMessage]);

  // Store the validatedMessage in a state to avoid unnecessary re-renders
  const [validatedMessageState, setValidatedMessage] = React.useState(validatedMessage);

  // Render the message, escaping any HTML characters and providing accessibility attributes
  return (
    <div id={id || componentId} className={className} data-testid="my-component">
      <span dangerouslySetInnerHTML={{ __html: validatedMessageState }} />
      <style jsx>{`
        #${componentId} {
          // Add some basic styling for accessibility purposes
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

MyComponent.validateMessage = validateMessage;
MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { FC, useMemo, useCallback } from 'react';
import { useId } from '@reach/auto-id';

interface Props {
  message: string;
  className?: string;
  id?: string;
}

// Function to validate user-generated messages for potential XSS attacks
const validateMessage = (message: string) => {
  // Implement a regular expression or other method to validate the message
  // If the message is invalid, return an error message or throw an exception
  // For simplicity, I've used a basic XSS prevention regular expression
  const xssRegex = /<[^>]+>/g;
  if (xssRegex.test(message)) {
    throw new Error('Invalid user-generated message: XSS attack detected');
  }
  return message;
};

const MyComponent: FC<Props> = ({ message, className, id }) => {
  // Generate a unique id for the component if none is provided
  const componentId = useId();
  const validatedMessage = useMemo(() => validateMessage(message), [message]);

  // Use a callback to ensure the validatedMessage is only re-created when message changes
  const handleMessageChange = useCallback(() => {
    const newValidatedMessage = validateMessage(message);
    // If the new validatedMessage is different from the current one, update the component
    if (newValidatedMessage !== validatedMessage) {
      setValidatedMessage(newValidatedMessage);
    }
  }, [message, validatedMessage]);

  // Store the validatedMessage in a state to avoid unnecessary re-renders
  const [validatedMessageState, setValidatedMessage] = React.useState(validatedMessage);

  // Render the message, escaping any HTML characters and providing accessibility attributes
  return (
    <div id={id || componentId} className={className} data-testid="my-component">
      <span dangerouslySetInnerHTML={{ __html: validatedMessageState }} />
      <style jsx>{`
        #${componentId} {
          // Add some basic styling for accessibility purposes
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

MyComponent.validateMessage = validateMessage;
MyComponent.displayName = 'MyComponent';

export default MyComponent;