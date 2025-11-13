import React from 'react';

type Role = 'guest' | 'student' | 'instructor' | 'admin';

interface Props {
  role: Role; // Define role permission for user
  message: string;
  fallbackMessage?: string; // Optional fallback message for unsupported roles
}

const MyComponent: React.FC<Props> = ({ role, message, fallbackMessage = 'Unsupported role' }) => {
  // Check if user has appropriate role before displaying sensitive information
  const allowedRoles = ['admin', 'instructor'];
  if (allowedRoles.includes(role)) {
    return <div>{message}</div>;
  } else if (fallbackMessage) {
    return (
      <div>
        {fallbackMessage}
        <br />
        (Allowed roles: admin, instructor)
      </div>
    );
  } else {
    return (
      <div>
        Access denied. Please log in with an appropriate role.
        <br />
        (Allowed roles: admin, instructor)
      </div>
    );
  }
};

export default MyComponent;

import React from 'react';

type Role = 'guest' | 'student' | 'instructor' | 'admin';

interface Props {
  role: Role; // Define role permission for user
  message: string;
  fallbackMessage?: string; // Optional fallback message for unsupported roles
}

const MyComponent: React.FC<Props> = ({ role, message, fallbackMessage = 'Unsupported role' }) => {
  // Check if user has appropriate role before displaying sensitive information
  const allowedRoles = ['admin', 'instructor'];
  if (allowedRoles.includes(role)) {
    return <div>{message}</div>;
  } else if (fallbackMessage) {
    return (
      <div>
        {fallbackMessage}
        <br />
        (Allowed roles: admin, instructor)
      </div>
    );
  } else {
    return (
      <div>
        Access denied. Please log in with an appropriate role.
        <br />
        (Allowed roles: admin, instructor)
      </div>
    );
  }
};

export default MyComponent;