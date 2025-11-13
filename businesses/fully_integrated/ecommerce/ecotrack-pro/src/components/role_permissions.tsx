import React from 'react';

type Role = 'admin' | 'moderator' | 'user' | null;

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role | null; // User's current role
  message: string;
  children?: React.ReactNode; // Allows for custom content within the component
}

const MyComponent: React.FC<Props> = ({ children, roleRequired, role, message }) => {
  // Check if user has the required role before displaying the message or children
  if (roleRequired && role === roleRequired) {
    return children ? (
      <div>{children}</div>
    ) : (
      <div>{message}</div>
    );
  }

  // If the role is not provided or the user doesn't have the required role, display an access denied message
  return <div>Access denied</div>;
};

// Function to check if the user has a specific role
function hasRole(userRole: Role | null, requiredRole: Role): userRole is Role {
  return userRole !== null && userRole === requiredRole;
}

// Function to check the user's role against the required roles for each component
function checkRole(userRole: Role | null, requiredRole: Role): boolean {
  return hasRole(userRole, requiredRole);
}

// Function to check if the user has any of the provided roles
function hasAnyRole(userRole: Role | null, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole as Role);
}

// Function to check if the user has any of the required roles for a component
function checkAnyRole(userRole: Role | null, requiredRoles: Role[]): boolean {
  return hasAnyRole(userRole, requiredRoles);
}

export default MyComponent;

import React from 'react';

type Role = 'admin' | 'moderator' | 'user' | null;

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role | null; // User's current role
  message: string;
  children?: React.ReactNode; // Allows for custom content within the component
}

const MyComponent: React.FC<Props> = ({ children, roleRequired, role, message }) => {
  // Check if user has the required role before displaying the message or children
  if (roleRequired && role === roleRequired) {
    return children ? (
      <div>{children}</div>
    ) : (
      <div>{message}</div>
    );
  }

  // If the role is not provided or the user doesn't have the required role, display an access denied message
  return <div>Access denied</div>;
};

// Function to check if the user has a specific role
function hasRole(userRole: Role | null, requiredRole: Role): userRole is Role {
  return userRole !== null && userRole === requiredRole;
}

// Function to check the user's role against the required roles for each component
function checkRole(userRole: Role | null, requiredRole: Role): boolean {
  return hasRole(userRole, requiredRole);
}

// Function to check if the user has any of the provided roles
function hasAnyRole(userRole: Role | null, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole as Role);
}

// Function to check if the user has any of the required roles for a component
function checkAnyRole(userRole: Role | null, requiredRoles: Role[]): boolean {
  return hasAnyRole(userRole, requiredRoles);
}

export default MyComponent;