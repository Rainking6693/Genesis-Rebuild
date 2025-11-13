import React from 'react';

type RolePermission = 'reader' | 'editor' | 'admin';

interface Props {
  message: string;
  permission: RolePermission;
  onUnauthorized?: () => void; // Optional callback for handling unauthorized access
  userRoles?: RolePermission[]; // Added optional user roles prop for flexibility
}

const isUserAuthorized = (permission: RolePermission, roles?: RolePermission[]): boolean => {
  return roles?.includes(permission) ?? false; // Use nullish coalescing operator to handle missing roles
};

const MyComponent: React.FC<Props> = ({ message, permission, onUnauthorized, userRoles = [] }) => {
  // Use optional chaining to avoid errors when userRoles is undefined or null
  const userHasPermission = isUserAuthorized(permission, userRoles);

  if (!userHasPermission) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return (
      <div>
        You do not have the required permissions to view this content.
        {/* Added ARIA attributes for accessibility */}
        <p aria-label="Permissions required">Permissions required: {permission}</p>
        <p aria-label="Your permissions">Your permissions: {userRoles.join(', ')}</p>
      </div>
    );
  }

  return <div>{message}</div>;
};

export default MyComponent;

import React from 'react';

type RolePermission = 'reader' | 'editor' | 'admin';

interface Props {
  message: string;
  permission: RolePermission;
  onUnauthorized?: () => void; // Optional callback for handling unauthorized access
  userRoles?: RolePermission[]; // Added optional user roles prop for flexibility
}

const isUserAuthorized = (permission: RolePermission, roles?: RolePermission[]): boolean => {
  return roles?.includes(permission) ?? false; // Use nullish coalescing operator to handle missing roles
};

const MyComponent: React.FC<Props> = ({ message, permission, onUnauthorized, userRoles = [] }) => {
  // Use optional chaining to avoid errors when userRoles is undefined or null
  const userHasPermission = isUserAuthorized(permission, userRoles);

  if (!userHasPermission) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return (
      <div>
        You do not have the required permissions to view this content.
        {/* Added ARIA attributes for accessibility */}
        <p aria-label="Permissions required">Permissions required: {permission}</p>
        <p aria-label="Your permissions">Your permissions: {userRoles.join(', ')}</p>
      </div>
    );
  }

  return <div>{message}</div>;
};

export default MyComponent;