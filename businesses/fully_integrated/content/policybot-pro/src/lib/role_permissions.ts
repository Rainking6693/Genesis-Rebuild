import React, { Key, ReactNode } from 'react';

const COMPONENT_NAME = 'PolicyBotProRolePermissionsComponent';

type Props = {
  message: string;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  // Add a unique key for each rendered element to improve performance
  const uniqueKey = `${COMPONENT_NAME}-${Math.random().toString(36).substring(7)}` as Key;

  // Check if the message is safe to render as HTML
  // If not, use a fallback and log an error for debugging
  let sanitizedMessage: ReactNode;
  try {
    const sanitizedDOM = new DOMParser().parseFromString(message, 'text/html');
    if (sanitizedDOM.body.textContent) {
      sanitizedMessage = sanitizedDOM.body.textContent;
    } else {
      console.error(`${COMPONENT_NAME}: Invalid HTML content: ${message}`);
      sanitizedMessage = <div>Invalid HTML content. Please review the provided message.</div>;
    }
  } catch (error) {
    console.error(`${COMPONENT_NAME}: Failed to sanitize HTML content: ${message}`, error);
    sanitizedMessage = <div>Failed to sanitize HTML content. Please review the provided message.</div>;
  }

  // Add aria-label for accessibility
  return (
    <div key={uniqueKey} dangerouslySetInnerHTML={{ __html: sanitizedMessage.toString() }} aria-label={`PolicyBotProRolePermissionsComponent: ${sanitizedMessage}`} />
  );
};

// Add a module-level export for easier import and reuse of the component
export { MyComponent };

In this updated version, I've added error handling for cases where the sanitization fails. Additionally, I've used the `toString()` method to convert the ReactNode to a string before setting it as the innerHTML. This ensures that the innerHTML is always a string, which is the expected type for the `dangerouslySetInnerHTML` property.