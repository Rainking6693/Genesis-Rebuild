import React, { ReactNode, FC } from 'react';
import { RoleBasedAccessControl } from '@mindshift-analytics/security-library';

type Props = {
  message: ReactNode;
  requiredRole?: string; // Added optional 'requiredRole' for flexibility
};

const MyComponent: FC<Props> = ({ message, requiredRole = 'guest' }) => {
  // Check if user has the required role before displaying the message
  if (RoleBasedAccessControl.checkPermission(requiredRole)) {
    return <div>{message}</div>;
  }

  // Display an error message for unauthorized access
  return (
    <div>
      Unauthorized access. Please contact support.
      <a href="mailto:support@yourcompany.com">Contact us</a>
    </div>
  );
};

// Add a default role for unauthenticated users to prevent errors
MyComponent.defaultProps = {
  requiredRole: 'guest',
};

export default MyComponent;

import React, { ReactNode, FC } from 'react';
import { RoleBasedAccessControl } from '@mindshift-analytics/security-library';

type Props = {
  message: ReactNode;
  requiredRole?: string; // Added optional 'requiredRole' for flexibility
};

const MyComponent: FC<Props> = ({ message, requiredRole = 'guest' }) => {
  // Check if user has the required role before displaying the message
  if (RoleBasedAccessControl.checkPermission(requiredRole)) {
    return <div>{message}</div>;
  }

  // Display an error message for unauthorized access
  return (
    <div>
      Unauthorized access. Please contact support.
      <a href="mailto:support@yourcompany.com">Contact us</a>
    </div>
  );
};

// Add a default role for unauthenticated users to prevent errors
MyComponent.defaultProps = {
  requiredRole: 'guest',
};

export default MyComponent;