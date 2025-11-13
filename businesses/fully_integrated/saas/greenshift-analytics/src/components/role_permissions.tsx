import React from 'react';

interface RolePermissionsProps {
  message: string;
  userRole?: string; // Add userRole property with optional type
}

// RolePermissionsMessage component
const RolePermissionsMessage: React.FC<RolePermissionsProps> = ({ message }) => {
  return <div role="alert">{message}</div>;
};

// RoleBasedComponent component
const RoleBasedComponent: React.FC<RolePermissionsProps> = ({ message, userRole }) => {
  // Check if userRole is provided
  if (!userRole) {
    return <div role="alert">User role not provided</div>;
  }

  // Check if user has appropriate role before rendering the component
  if (userRole === 'admin') {
    return <RolePermissionsMessage message={message} />;
  } else {
    return <div role="alert">Access denied</div>;
  }
};

// RolePermissionsComponent (now using RoleBasedComponent)
const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({ message, userRole }) => {
  // Check if userRole is provided
  if (!userRole) {
    return <div role="alert">User role not provided</div>;
  }

  // Render RoleBasedComponent with provided message and userRole
  return <RoleBasedComponent message={message} userRole={userRole} />;
};

// Add a default userRole for cases where it's not provided
RolePermissionsComponent.defaultProps = {
  userRole: 'guest',
};

export default RolePermissionsComponent;

In this updated code:

1. I added the `role` attribute to the `RolePermissionsMessage` component for better accessibility.
2. I made the `userRole` property optional to allow for cases where it might not be provided.
3. I added a default value for `userRole` in the `RolePermissionsComponent` to handle cases where it's not provided.
4. I used the `defaultProps` property to set the default value for `userRole`.
5. I added a check for the `userRole` in the `RolePermissionsComponent` to ensure that it's always passed to the `RoleBasedComponent`.
6. I used the `===` operator instead of `==` for strict type comparison.
7. I used the `defaultProps` property to set the default value for `userRole` to 'guest' or any other suitable default role.