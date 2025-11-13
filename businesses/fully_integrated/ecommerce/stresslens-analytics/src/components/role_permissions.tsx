import React, { FC, ReactNode } from 'react';

type Role = 'admin' | 'manager' | 'employee';

interface Props {
  message: ReactNode;
  rolePermissionCheck?: (role: Role) => boolean;
}

const defaultRolePermissionCheck = (role: Role): boolean => {
  // Default role permission check function. You can override this function if needed.
  switch (role) {
    case 'admin':
      return true;
    case 'manager':
      return true; // Modify this based on your business requirements
    case 'employee':
      return false;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
};

const MyComponent: FC<Props> = ({ message, rolePermissionCheck = defaultRolePermissionCheck }) => {
  // Check if the rolePermissionCheck function is provided, otherwise use the default one
  const rolePermissionCheckFn = rolePermissionCheck || defaultRolePermissionCheck;

  // Get the user's role from your application state or context
  const userRole = // Your implementation here

  // If the user's role is not available, return an error message or handle it appropriately in your application
  if (!userRole) {
    return <div>Error: User's role is not available</div>;
  }

  // Check role permissions before rendering the message
  if (rolePermissionCheckFn(userRole)) {
    return <div>{message}</div>;
  }
  return null;
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

type Role = 'admin' | 'manager' | 'employee';

interface Props {
  message: ReactNode;
  rolePermissionCheck?: (role: Role) => boolean;
}

const defaultRolePermissionCheck = (role: Role): boolean => {
  // Default role permission check function. You can override this function if needed.
  switch (role) {
    case 'admin':
      return true;
    case 'manager':
      return true; // Modify this based on your business requirements
    case 'employee':
      return false;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
};

const MyComponent: FC<Props> = ({ message, rolePermissionCheck = defaultRolePermissionCheck }) => {
  // Check if the rolePermissionCheck function is provided, otherwise use the default one
  const rolePermissionCheckFn = rolePermissionCheck || defaultRolePermissionCheck;

  // Get the user's role from your application state or context
  const userRole = // Your implementation here

  // If the user's role is not available, return an error message or handle it appropriately in your application
  if (!userRole) {
    return <div>Error: User's role is not available</div>;
  }

  // Check role permissions before rendering the message
  if (rolePermissionCheckFn(userRole)) {
    return <div>{message}</div>;
  }
  return null;
};

export default MyComponent;