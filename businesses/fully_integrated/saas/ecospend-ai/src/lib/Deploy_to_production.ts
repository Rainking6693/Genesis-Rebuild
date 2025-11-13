import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message ? (
    <div
      {...rest}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  ) : (
    children
  );

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  // Add a default value for message prop
  message: '',
};

MyComponent.propTypes = {
  message: require('prop-types').string,
};

// Use named export for better readability and maintainability
export const EcoSpendAIComponent = MyComponent;

// Add a type for children to support additional content
interface ChildrenProps {
  children?: ReactNode;
}

// Create a new component that wraps MyComponent with a div for accessibility
const AccessibleMyComponent: FC<ChildrenProps & Props> = ({ children, ...props }) => {
  return (
    <div>
      {children}
      <EcoSpendAIComponent {...props} />
    </div>
  );
};

// Export the accessible component
export { AccessibleMyComponent };

import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message ? (
    <div
      {...rest}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  ) : (
    children
  );

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  // Add a default value for message prop
  message: '',
};

MyComponent.propTypes = {
  message: require('prop-types').string,
};

// Use named export for better readability and maintainability
export const EcoSpendAIComponent = MyComponent;

// Add a type for children to support additional content
interface ChildrenProps {
  children?: ReactNode;
}

// Create a new component that wraps MyComponent with a div for accessibility
const AccessibleMyComponent: FC<ChildrenProps & Props> = ({ children, ...props }) => {
  return (
    <div>
      {children}
      <EcoSpendAIComponent {...props} />
    </div>
  );
};

// Export the accessible component
export { AccessibleMyComponent };