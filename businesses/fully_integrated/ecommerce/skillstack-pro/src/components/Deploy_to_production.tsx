import React, { FC, ReactNode, DefaultHTMLProps, DetailedHTMLProps, PropsWithChildren } from 'react';

type MyComponentProps = PropsWithChildren<DefaultHTMLProps<HTMLDivElement>>;

const MyComponent: FC<MyComponentProps> = ({ children, ...rest }) => {
  // Use children instead of message for better flexibility
  // and to handle more complex content
  return (
    <div
      dangerouslySetInnerHTML={{ __html: children }}
      {...rest}
      // Add 'aria-label' for accessibility
      aria-label="MyComponent content"
    />
  );
};

// Add error handling and logging for production deployment
MyComponent.error = (error: Error) => {
  console.error(`MyComponent encountered an error: ${error.message}`);
};

// Add type checking for props
MyComponent.displayName = 'MyComponent';
MyComponent.defaultProps = {
  // Use children instead of message for better flexibility
  children: '',
};

export default MyComponent;

import React, { FC, ReactNode, DefaultHTMLProps, DetailedHTMLProps, PropsWithChildren } from 'react';

type MyComponentProps = PropsWithChildren<DefaultHTMLProps<HTMLDivElement>>;

const MyComponent: FC<MyComponentProps> = ({ children, ...rest }) => {
  // Use children instead of message for better flexibility
  // and to handle more complex content
  return (
    <div
      dangerouslySetInnerHTML={{ __html: children }}
      {...rest}
      // Add 'aria-label' for accessibility
      aria-label="MyComponent content"
    />
  );
};

// Add error handling and logging for production deployment
MyComponent.error = (error: Error) => {
  console.error(`MyComponent encountered an error: ${error.message}`);
};

// Add type checking for props
MyComponent.displayName = 'MyComponent';
MyComponent.defaultProps = {
  // Use children instead of message for better flexibility
  children: '',
};

export default MyComponent;