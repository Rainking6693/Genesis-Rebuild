import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitizeUserInput as SanitizeUserInputFunction } from '../../utils/security';

type SanitizeUserInput = (message: string) => string;

type Props = PropsWithChildren<{
  message: string;
}>;

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizeUserInput: SanitizeUserInput = sanitizeUserInput || (text => text); // Use default sanitizeUserInput function if not provided
  const sanitizedMessage = sanitizeUserInput(message); // Sanitize user input for security

  // Add ARIA-label for accessibility
  const ariaLabel = 'Newsletter content';

  // Check if sanitizedMessage is empty or null before rendering to avoid errors
  if (!sanitizedMessage) {
    return <div aria-label={ariaLabel}></div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Add ARIA-label for accessibility
    >
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitizeUserInput as SanitizeUserInputFunction } from '../../utils/security';

type SanitizeUserInput = (message: string) => string;

type Props = PropsWithChildren<{
  message: string;
}>;

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizeUserInput: SanitizeUserInput = sanitizeUserInput || (text => text); // Use default sanitizeUserInput function if not provided
  const sanitizedMessage = sanitizeUserInput(message); // Sanitize user input for security

  // Add ARIA-label for accessibility
  const ariaLabel = 'Newsletter content';

  // Check if sanitizedMessage is empty or null before rendering to avoid errors
  if (!sanitizedMessage) {
    return <div aria-label={ariaLabel}></div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel} // Add ARIA-label for accessibility
    >
      {children}
    </div>
  );
};

export default MyComponent;