import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const MyComponent: FC<Props> = ({ children, ...divProps }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedChildren = DOMPurify.sanitize(children.toString());

  // Add a role for accessibility
  const role = 'alert';

  // Check if children is a string before setting innerHTML
  if (typeof children === 'string') {
    return <div {...divProps} role={role} dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />;
  }

  // Handle edge case when children is not a string
  return (
    <div {...divProps} role={role}>
      {children}
      {/* Log the error for unexpected content */}
      <div style={{ display: 'none' }}>
        Error rendering MyComponent: Expected string, received {typeof children}.
      </div>
    </div>
  );
};

// Add error handling and logging for potential issues with the message content
MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

// Ensure proper export
export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const MyComponent: FC<Props> = ({ children, ...divProps }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedChildren = DOMPurify.sanitize(children.toString());

  // Add a role for accessibility
  const role = 'alert';

  // Check if children is a string before setting innerHTML
  if (typeof children === 'string') {
    return <div {...divProps} role={role} dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />;
  }

  // Handle edge case when children is not a string
  return (
    <div {...divProps} role={role}>
      {children}
      {/* Log the error for unexpected content */}
      <div style={{ display: 'none' }}>
        Error rendering MyComponent: Expected string, received {typeof children}.
      </div>
    </div>
  );
};

// Add error handling and logging for potential issues with the message content
MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

// Ensure proper export
export default MyComponent;