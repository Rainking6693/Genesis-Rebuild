import React, { FC, ReactNode, useContext } from 'react';
import { ValidationContext } from './ValidationContext';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...props }) => {
  const { validateMessage } = useContext(ValidationContext);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = React.createElement(
    'div',
    {
      ...props,
      dangerouslySetInnerHTML: { __html: validateMessage(message) },
    },
  );

  // Use React.Children.toArray to ensure only one child element
  const children = React.Children.toArray(sanitizedMessage);
  if (children.length > 1) {
    throw new Error('MyComponent should only have one child element');
  }

  return children[0];
};

// Add error handling and validation for input message
const validateMessage = (message: string) => {
  // Validate the message length and check for common XSS attack patterns
  if (message.length > 1000 || message.includes('<') || message.includes('>')) {
    throw new Error('Invalid message');
  }
  return message;
};

// Create a validation context for easier validation access
const ValidationContext = React.createContext<{ validateMessage: (message: string) => string }>({
  validateMessage: validateMessage,
});

// Use a named export for better modularity and easier testing
export { MyComponent, validateMessage, ValidationContext };

// Add accessibility by wrapping the component with a div and adding aria-label
import React, { FC, ReactNode } from 'react';
import { ValidationContext } from './ValidationContext';

const AccessibleMyComponent: FC<Props> = ({ message, ...props }) => {
  const { validateMessage } = useContext(ValidationContext);

  return (
    <div aria-label="MyComponent">
      <MyComponent message={validateMessage(message)} {...props} />
    </div>
  );
};

// Export the accessible version for better accessibility out of the box
export default AccessibleMyComponent;

import React, { FC, ReactNode, useContext } from 'react';
import { ValidationContext } from './ValidationContext';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...props }) => {
  const { validateMessage } = useContext(ValidationContext);

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = React.createElement(
    'div',
    {
      ...props,
      dangerouslySetInnerHTML: { __html: validateMessage(message) },
    },
  );

  // Use React.Children.toArray to ensure only one child element
  const children = React.Children.toArray(sanitizedMessage);
  if (children.length > 1) {
    throw new Error('MyComponent should only have one child element');
  }

  return children[0];
};

// Add error handling and validation for input message
const validateMessage = (message: string) => {
  // Validate the message length and check for common XSS attack patterns
  if (message.length > 1000 || message.includes('<') || message.includes('>')) {
    throw new Error('Invalid message');
  }
  return message;
};

// Create a validation context for easier validation access
const ValidationContext = React.createContext<{ validateMessage: (message: string) => string }>({
  validateMessage: validateMessage,
});

// Use a named export for better modularity and easier testing
export { MyComponent, validateMessage, ValidationContext };

// Add accessibility by wrapping the component with a div and adding aria-label
import React, { FC, ReactNode } from 'react';
import { ValidationContext } from './ValidationContext';

const AccessibleMyComponent: FC<Props> = ({ message, ...props }) => {
  const { validateMessage } = useContext(ValidationContext);

  return (
    <div aria-label="MyComponent">
      <MyComponent message={validateMessage(message)} {...props} />
    </div>
  );
};

// Export the accessible version for better accessibility out of the box
export default AccessibleMyComponent;