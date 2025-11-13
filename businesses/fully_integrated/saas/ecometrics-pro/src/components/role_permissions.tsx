import React from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Props {
  roleRequired: Role[]; // Required roles for this component
  role: Role | null; // User's role
  message: string;
}

const MyComponent: React.FC<Props> = ({ roleRequired, role, message }) => {
  // Check if user has any of the required roles before displaying the message
  if (roleRequired.some((requiredRole) => role === requiredRole)) {
    return <div>{message}</div>;
  }
  return <div>Access denied</div>;
};

// Use a type for the roles to ensure consistency and avoid typos
type AuthorizedRoles = Record<Role, boolean>;

const authorizedRoles: AuthorizedRoles = {
  admin: true,
  editor: false,
  viewer: false,
};

function checkRole(role: Role | null): Role | null {
  // Implement a function to get the user's role from the authentication system
  // For example, you could use a local storage, cookies, or an API call
  // ...

  // Handle the case when the user's role is not found or invalid
  if (!role) {
    return null;
  }

  // Ensure the role is valid
  if (!Object.values(Role).includes(role)) {
    console.error(`Invalid role provided: ${role}`);
    return null;
  }

  return role;
}

// Add a default role for unauthenticated users
const defaultRole: Role | null = null;

// Create a higher-order component to handle role authorization
const withRoleAuthorization = (Component: React.FC<any>) => {
  return function WithRoleAuthorization(props: Props) {
    const userRole = checkRole(defaultRole);

    if (!userRole) {
      return <div>Unauthorized</div>;
    }

    // Pass the user's role and the authorized roles to the component
    return <Component {...props} role={userRole} roleRequired={authorizedRoles[userRole] ? [userRole] : []} />;
  };
};

export default withRoleAuthorization(MyComponent);

import React from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Props {
  roleRequired: Role[]; // Required roles for this component
  role: Role | null; // User's role
  message: string;
}

const MyComponent: React.FC<Props> = ({ roleRequired, role, message }) => {
  // Check if user has any of the required roles before displaying the message
  if (roleRequired.some((requiredRole) => role === requiredRole)) {
    return <div>{message}</div>;
  }
  return <div>Access denied</div>;
};

// Use a type for the roles to ensure consistency and avoid typos
type AuthorizedRoles = Record<Role, boolean>;

const authorizedRoles: AuthorizedRoles = {
  admin: true,
  editor: false,
  viewer: false,
};

function checkRole(role: Role | null): Role | null {
  // Implement a function to get the user's role from the authentication system
  // For example, you could use a local storage, cookies, or an API call
  // ...

  // Handle the case when the user's role is not found or invalid
  if (!role) {
    return null;
  }

  // Ensure the role is valid
  if (!Object.values(Role).includes(role)) {
    console.error(`Invalid role provided: ${role}`);
    return null;
  }

  return role;
}

// Add a default role for unauthenticated users
const defaultRole: Role | null = null;

// Create a higher-order component to handle role authorization
const withRoleAuthorization = (Component: React.FC<any>) => {
  return function WithRoleAuthorization(props: Props) {
    const userRole = checkRole(defaultRole);

    if (!userRole) {
      return <div>Unauthorized</div>;
    }

    // Pass the user's role and the authorized roles to the component
    return <Component {...props} role={userRole} roleRequired={authorizedRoles[userRole] ? [userRole] : []} />;
  };
};

export default withRoleAuthorization(MyComponent);