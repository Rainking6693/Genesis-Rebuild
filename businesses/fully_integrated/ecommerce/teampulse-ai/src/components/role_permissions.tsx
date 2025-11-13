import React from 'react';

type Role = 'guest' | 'employee' | 'manager' | 'HR';

interface Props {
  message: string;
  userRole: Role; // Add user role for role-based permissions
}

const MyComponent: React.FC<Props> = ({ message, userRole }) => {
  // Check user role before displaying sensitive information
  const allowedRoles = ['manager', 'HR'];

  // Handle edge cases where userRole is not a valid role
  if (!allowedRoles.includes(userRole as Role)) {
    return <div>Invalid user role</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;

// Add a custom hook for role-based permissions
const useRoleBasedPermission = (userRole: Role, allowedRoles: Role[]) => {
  const hasPermission = allowedRoles.includes(userRole);
  return { hasPermission };
};

// Use the custom hook in MyComponent
const MyComponentWithPermissionCheck: React.FC<Props> = ({ message, userRole }) => {
  const { hasPermission } = useRoleBasedPermission(userRole, ['manager', 'HR']);

  // Handle edge cases where hasPermission is not a boolean
  if (typeof hasPermission !== 'boolean') {
    return <div>Error: hasPermission is not a boolean</div>;
  }

  return hasPermission ? <div>{message}</div> : <div>Access denied</div>;
};

export default MyComponentWithPermissionCheck;

import React from 'react';

type Role = 'guest' | 'employee' | 'manager' | 'HR';

interface Props {
  message: string;
  userRole: Role; // Add user role for role-based permissions
}

const MyComponent: React.FC<Props> = ({ message, userRole }) => {
  // Check user role before displaying sensitive information
  const allowedRoles = ['manager', 'HR'];

  // Handle edge cases where userRole is not a valid role
  if (!allowedRoles.includes(userRole as Role)) {
    return <div>Invalid user role</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;

// Add a custom hook for role-based permissions
const useRoleBasedPermission = (userRole: Role, allowedRoles: Role[]) => {
  const hasPermission = allowedRoles.includes(userRole);
  return { hasPermission };
};

// Use the custom hook in MyComponent
const MyComponentWithPermissionCheck: React.FC<Props> = ({ message, userRole }) => {
  const { hasPermission } = useRoleBasedPermission(userRole, ['manager', 'HR']);

  // Handle edge cases where hasPermission is not a boolean
  if (typeof hasPermission !== 'boolean') {
    return <div>Error: hasPermission is not a boolean</div>;
  }

  return hasPermission ? <div>{message}</div> : <div>Access denied</div>;
};

export default MyComponentWithPermissionCheck;