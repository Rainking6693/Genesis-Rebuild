import React, { PropsWithChildren, ReactNode } from 'react';
import { sanitizeUserInput } from '../../utils/security';

// Import utility function for sanitizing user input
import { sanitize } from '../../utils/security';

type Props = {
  id?: string;
  message: string;
};

const MyComponent: React.FC<Props> = ({ id, message }) => {
  const sanitizedMessage = sanitize(message); // Sanitize user input for security

  // Add a check for empty message to prevent rendering an empty div
  if (!sanitizedMessage.trim()) {
    return null;
  }

  // Use a fragment to ensure accessibility and avoid creating extra nodes
  const sanitizedMessageAsReactNode: ReactNode = (
    <div key={id || ''} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );

  return <>{sanitizedMessageAsReactNode}</>;
};

// To handle multiple instances of the component with different messages,
// we can use a functional component with children prop

const MyComponentWithChildren: React.FC<PropsWithChildren> = ({ children, id }) => {
  const sanitizedChildren = sanitize(children.toString()); // Sanitize user input for security

  // Add a check for empty message to prevent rendering an empty div
  if (!sanitizedChildren.trim()) {
    return null;
  }

  // Use a fragment to ensure accessibility and avoid creating extra nodes
  const sanitizedChildrenAsReactNode: ReactNode = (
    <div key={id || ''} dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />
  );

  return <>{sanitizedChildrenAsReactNode}</>;
};

export default MyComponent;
export default MyComponentWithChildren;

// Improve the sanitizeUserInput function to handle HTML entities

const sanitizeUserInput = (input: string): string => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };

  return input.replace(/[&<>"']/g, (match) => map[match]);
};