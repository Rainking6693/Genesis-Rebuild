import React, { FC, DefaultHTMLProps, PropsWithChildren, useState } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ children, ...props }) => {
  // Use children to pass the message safely
  const [message, setMessage] = useState(children);

  // Validate the message before rendering
  const validateMessage = (inputMessage: string) => {
    if (!inputMessage.trim()) {
      throw new Error('Message cannot be empty');
    }
    return inputMessage;
  };

  const validatedMessage = validateMessage(message);

  // Use dangerouslySetInnerHTML only when the message has been validated
  return (
    <div
      {...props}
      // Add aria-label to improve accessibility
      aria-label="Customer support message"
    >
      {validatedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />
      ) : (
        <p>Please provide a valid message.</p>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  // Use DefaultHTMLProps to set default props
  ...DefaultHTMLProps.withDefaultProps as Props,
};

// Use named export for better code organization and easier testing
export { MyComponent, validateMessage };

import React, { FC, DefaultHTMLProps, PropsWithChildren, useState } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ children, ...props }) => {
  // Use children to pass the message safely
  const [message, setMessage] = useState(children);

  // Validate the message before rendering
  const validateMessage = (inputMessage: string) => {
    if (!inputMessage.trim()) {
      throw new Error('Message cannot be empty');
    }
    return inputMessage;
  };

  const validatedMessage = validateMessage(message);

  // Use dangerouslySetInnerHTML only when the message has been validated
  return (
    <div
      {...props}
      // Add aria-label to improve accessibility
      aria-label="Customer support message"
    >
      {validatedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: validatedMessage }} />
      ) : (
        <p>Please provide a valid message.</p>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  // Use DefaultHTMLProps to set default props
  ...DefaultHTMLProps.withDefaultProps as Props,
};

// Use named export for better code organization and easier testing
export { MyComponent, validateMessage };