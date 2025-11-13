import React from 'react';

type Role = 'admin' | 'moderator' | 'user' | null;

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role | null; // User's current role
  message: string;
  children?: React.ReactNode; // Allows for passing additional content to the component
}

const MyComponent: React.FC<Props> = ({ children, roleRequired, role, message }) => {
  // Check if user has the required role before rendering the children or the access denied message
  if (role && role === roleRequired) {
    return <div>{children || message}</div>;
  }
  return <div>Access denied</div>;
};

// Define a default role for unauthenticated users
const defaultRole: Role = null;

// Implement a function to check the user's role against the required roles for this component
// For example, you could use a role-based access control (RBAC) system or a simple list of allowed roles
const checkRole = (roleRequired: Role, userRole: Role | null = defaultRole) => {
  return userRole !== null && userRole === roleRequired;
};

// Add a propTypes validation for the roleRequired and role props
MyComponent.propTypes = {
  roleRequired: React.PropTypes.oneOf(['admin', 'moderator', 'user', null]).isRequired,
  role: React.PropTypes.oneOf(['admin', 'moderator', 'user', null]),
};

// Add a defaultProps for the role prop
MyComponent.defaultProps = {
  role: defaultRole,
};

export default MyComponent;

import React from 'react';

type Role = 'admin' | 'moderator' | 'user' | null;

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role | null; // User's current role
  message: string;
  children?: React.ReactNode; // Allows for passing additional content to the component
}

const MyComponent: React.FC<Props> = ({ children, roleRequired, role, message }) => {
  // Check if user has the required role before rendering the children or the access denied message
  if (role && role === roleRequired) {
    return <div>{children || message}</div>;
  }
  return <div>Access denied</div>;
};

// Define a default role for unauthenticated users
const defaultRole: Role = null;

// Implement a function to check the user's role against the required roles for this component
// For example, you could use a role-based access control (RBAC) system or a simple list of allowed roles
const checkRole = (roleRequired: Role, userRole: Role | null = defaultRole) => {
  return userRole !== null && userRole === roleRequired;
};

// Add a propTypes validation for the roleRequired and role props
MyComponent.propTypes = {
  roleRequired: React.PropTypes.oneOf(['admin', 'moderator', 'user', null]).isRequired,
  role: React.PropTypes.oneOf(['admin', 'moderator', 'user', null]),
};

// Add a defaultProps for the role prop
MyComponent.defaultProps = {
  role: defaultRole,
};

export default MyComponent;