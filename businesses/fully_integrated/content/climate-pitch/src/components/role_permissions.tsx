import React from 'react';

type Role = 'guest' | 'user' | 'admin' | 'editor';

interface Props {
  role?: Role; // Add role permission for access control
  message: string;
  fallbackMessage?: string; // Optional fallback message for unauthorized users
  isAuthorized?: boolean; // Flag to indicate if the user is authorized
}

const MyComponent: React.FC<Props> = ({ role, message, fallbackMessage = 'Unauthorized', isAuthorized = false }) => {
  // Calculate if user is authorized based on the provided role and authorized roles
  const authorizedRoles: Role[] = ['admin', 'editor'];
  const isUserAuthorized = isAuthorized || (role && authorizedRoles.includes(role));

  // Add a check for undefined or null values of role and message
  if (!message || !isUserAuthorized) {
    return null;
  }

  return <div>{isUserAuthorized ? message : fallbackMessage}</div>; // Return message if user is authorized, else return fallback message
};

export default MyComponent;

import React from 'react';

type Role = 'guest' | 'user' | 'admin' | 'editor';

interface Props {
  role?: Role; // Add role permission for access control
  message: string;
  fallbackMessage?: string; // Optional fallback message for unauthorized users
  isAuthorized?: boolean; // Flag to indicate if the user is authorized
}

const MyComponent: React.FC<Props> = ({ role, message, fallbackMessage = 'Unauthorized', isAuthorized = false }) => {
  // Calculate if user is authorized based on the provided role and authorized roles
  const authorizedRoles: Role[] = ['admin', 'editor'];
  const isUserAuthorized = isAuthorized || (role && authorizedRoles.includes(role));

  // Add a check for undefined or null values of role and message
  if (!message || !isUserAuthorized) {
    return null;
  }

  return <div>{isUserAuthorized ? message : fallbackMessage}</div>; // Return message if user is authorized, else return fallback message
};

export default MyComponent;