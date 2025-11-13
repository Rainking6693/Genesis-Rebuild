import React, { FC, ReactNode, Key, HTMLAttributes } from 'react';

interface SanitizedMessage {
  value: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

const sanitizeMessage = (message: string): SanitizedMessage => {
  try {
    // Implement a simple XSS sanitization function
    // For production use, consider using a library like DOMPurify
    const sanitizedMessage = message
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&([a-zA-Z]{1,5})?;/g, entityDecoder) // Decode HTML entities
      .replace(/[\/\*\{\}\(\)\[\]\@\\\'\"]/g, ''); // Remove special characters

    function entityDecoder(entity) {
      return entity.replace(/&/g, '&amp;').replace(/#/g, '&#');
    }

    return { value: sanitizedMessage };
  } catch (error) {
    console.error('Error sanitizing message:', error);
    console.error('Error stack trace:', error.stack);
    return { value: message };
  }
};

const MyComponent: FC<Props> = ({ message, children, ...rest }) => {
  const { value: sanitizedMessage } = sanitizeMessage(message);

  // Add ARIA attributes for accessibility
  const ariaLabel = 'Dashboard message';
  const ariaDescription = sanitizedMessage;

  // Check if message is empty to prevent rendering an empty div
  if (!sanitizedMessage) return null;

  return (
    <div
      data-testid="dashboard-ui-message"
      className="moodsync-message"
      role="alert"
      aria-label={ariaLabel}
      aria-describedby={ariaLabel}
      {...rest}
    >
      {sanitizedMessage}
      {children}
    </div>
  );
};

// Add a unique key for each rendered element for performance optimization
MyComponent.defaultProps = {
  key: Math.random().toString(),
};

// Use a consistent naming convention for components (PascalCase)
export const DashboardUIMessage = MyComponent;

This version of the component now includes a `data-testid` attribute for easier testing, checks for empty messages, and provides a more consistent naming convention for the component. Additionally, it logs the error message and its stack trace for better debugging.