import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{}> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Sanitize user-provided message to prevent XSS attacks
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';

  // Check if the sanitized message is not empty before rendering to avoid an empty div
  if (sanitizedMessage) {
    return (
      <div
        // Add ARIA attributes for accessibility
        aria-label="MyComponent"
        role="presentation"
      >
        {/* Use ReactNode to allow any valid React element as children */}
        {React.isValidElement(children) ? (
          <>{children}</>
        ) : (
          <div
            // Use dangerouslySetInnerHTML only when message prop is provided
            dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          />
        )}
      </div>
    );
  }

  return null;
};

// PropTypes validation for the message prop
MyComponent.propTypes = {
  message: React.PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{}> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  // Sanitize user-provided message to prevent XSS attacks
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';

  // Check if the sanitized message is not empty before rendering to avoid an empty div
  if (sanitizedMessage) {
    return (
      <div
        // Add ARIA attributes for accessibility
        aria-label="MyComponent"
        role="presentation"
      >
        {/* Use ReactNode to allow any valid React element as children */}
        {React.isValidElement(children) ? (
          <>{children}</>
        ) : (
          <div
            // Use dangerouslySetInnerHTML only when message prop is provided
            dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          />
        )}
      </div>
    );
  }

  return null;
};

// PropTypes validation for the message prop
MyComponent.propTypes = {
  message: React.PropTypes.string,
};

export default MyComponent;