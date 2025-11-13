import React, { FunctionComponent, DetailedHTMLProps, Key } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string; // Add optional for message
}

// Use PascalCase for component names for better readability and consistency
const EcoTrackProMessage: FunctionComponent<Props> = ({ className, id, message, ...rest }) => {
  // Add a key prop for React performance optimization
  const key: Key = message ? 'message' : undefined; // Generate key only if message is provided

  // Add aria-label for accessibility
  const ariaLabel = 'EcoTrackPro message';

  // Handle edge cases where message is empty or null
  if (!message) {
    return <div {...rest} />;
  }

  // Use a safe innerHTML property to prevent XSS attacks
  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') // Add replacement for double quotes
    .replace(/'/g, '&#39;'); // Add replacement for single quotes

  return (
    <div key={key} className={className} id={id} aria-label={ariaLabel} dangerouslySetInnerHTML={{ __html: safeMessage }} {...rest} />
  );
};

// Use named exports for better modularity and maintainability
export { EcoTrackProMessage };

import React, { FunctionComponent, DetailedHTMLProps, Key } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string; // Add optional for message
}

// Use PascalCase for component names for better readability and consistency
const EcoTrackProMessage: FunctionComponent<Props> = ({ className, id, message, ...rest }) => {
  // Add a key prop for React performance optimization
  const key: Key = message ? 'message' : undefined; // Generate key only if message is provided

  // Add aria-label for accessibility
  const ariaLabel = 'EcoTrackPro message';

  // Handle edge cases where message is empty or null
  if (!message) {
    return <div {...rest} />;
  }

  // Use a safe innerHTML property to prevent XSS attacks
  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') // Add replacement for double quotes
    .replace(/'/g, '&#39;'); // Add replacement for single quotes

  return (
    <div key={key} className={className} id={id} aria-label={ariaLabel} dangerouslySetInnerHTML={{ __html: safeMessage }} {...rest} />
  );
};

// Use named exports for better modularity and maintainability
export { EcoTrackProMessage };