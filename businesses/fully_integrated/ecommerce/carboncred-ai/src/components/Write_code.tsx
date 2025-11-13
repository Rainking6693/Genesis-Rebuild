import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { sanitizeHtml } from 'dompurify'; // Import a sanitization library

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allow for additional child elements
  ariaLabel?: string; // Add an aria-label for accessibility
}

const MyComponent: FC<Props> = ({ className, style, message, children, ariaLabel, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message); // Add a sanitization function to prevent XSS attacks

  // Add a check for sanitizedMessage to ensure it's not empty
  if (!sanitizedMessage) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Use the provided ariaLabel if available, otherwise use the message
      {...rest} // Forward any additional props
    >
      {children} // Render any additional child elements
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { sanitizeHtml } from 'dompurify'; // Import a sanitization library

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allow for additional child elements
  ariaLabel?: string; // Add an aria-label for accessibility
}

const MyComponent: FC<Props> = ({ className, style, message, children, ariaLabel, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message); // Add a sanitization function to prevent XSS attacks

  // Add a check for sanitizedMessage to ensure it's not empty
  if (!sanitizedMessage) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Use the provided ariaLabel if available, otherwise use the message
      {...rest} // Forward any additional props
    >
      {children} // Render any additional child elements
    </div>
  );
};

export default MyComponent;