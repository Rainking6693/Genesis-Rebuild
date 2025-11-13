import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';

// Custom utility to ensure the message is not empty
function ensureNonEmptyMessage(message: string): string {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }
  return message;
}

// Custom utility to capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Ensure the message is not empty before rendering
  const formattedMessage = ensureNonEmptyMessage(message);

  // Capitalize the first letter of the message for better readability
  const capitalizedMessage = capitalizeFirstLetter(formattedMessage);

  // Add ARIA attributes for accessibility
  const ariaLabel = `Message: ${capitalizedMessage}`;

  return (
    <div>
      {/* Add a role="presentation" to hide the div from screen readers */}
      <div role="presentation">{capitalizedMessage}</div>
      {/* Add an ARIA label for screen reader accessibility */}
      <div aria-label={ariaLabel} />
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

This updated component now includes error handling for empty messages, capitalizes the first letter of the message for better readability, and adds ARIA attributes for accessibility. The component is also more maintainable due to the addition of utility functions and better organization of the code.