import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
}

const MyComponent: FC<Props> = ({ className, style, message, children, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Use a library like DOMPurify to sanitize the HTML content

  // Add aria-label for accessibility
  const ariaLabel = message || 'Component content';

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Add aria-label for accessibility
      {...rest}
    >
      {children} // Allow for additional content within the component
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  style: {},
};

// Add error handling and logging for potential issues with message content
MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

// Ensure proper export
export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
}

const MyComponent: FC<Props> = ({ className, style, message, children, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Use a library like DOMPurify to sanitize the HTML content

  // Add aria-label for accessibility
  const ariaLabel = message || 'Component content';

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Add aria-label for accessibility
      {...rest}
    >
      {children} // Allow for additional content within the component
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  style: {},
};

// Add error handling and logging for potential issues with message content
MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

// Ensure proper export
export default MyComponent;