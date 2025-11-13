import React, { ReactNode } from 'react';

type Role = 'guest' | 'registered_user' | 'authorized_user';

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role; // User's current role
  message: string;
  fallbackMessage?: string; // Optional error message for unauthorized users
  children?: ReactNode; // Allows for custom fallback content
}

const MyComponent: React.FC<Props> = ({
  roleRequired,
  role,
  message,
  fallbackMessage = 'You do not have permission to view this content.',
  children,
}) => {
  // Check if user has the required role before displaying the message or children
  if (roleRequired === role) {
    return <div>{message}</div>;
  }

  // If no children are provided, use the fallback message
  return <div>{children || fallbackMessage}</div>;
};

export default MyComponent;

import React, { ReactNode } from 'react';

type Role = 'guest' | 'registered_user' | 'authorized_user';

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role; // User's current role
  message: string;
  fallbackMessage?: string; // Optional error message for unauthorized users
  children?: ReactNode; // Allows for custom fallback content
}

const MyComponent: React.FC<Props> = ({
  roleRequired,
  role,
  message,
  fallbackMessage = 'You do not have permission to view this content.',
  children,
}) => {
  // Check if user has the required role before displaying the message or children
  if (roleRequired === role) {
    return <div>{message}</div>;
  }

  // If no children are provided, use the fallback message
  return <div>{children || fallbackMessage}</div>;
};

export default MyComponent;