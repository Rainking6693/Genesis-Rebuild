import React from 'react';

type Role = 'admin' | 'moderator' | 'user';

interface Props {
  roleRequired: Role; // Required role for access control
  role: Role | null; // User's role from the security system
  message: string;
  children?: React.ReactNode; // Allows for custom error messages
}

const MyComponent: React.FC<Props> = ({
  roleRequired,
  role,
  message,
  children,
}) => {
  // Check if user has the required role before displaying the message
  if (roleRequired && role && role === roleRequired) {
    return <div>{message}</div>;
  }

  // Handle edge cases where roleRequired or role is null or undefined
  if (!roleRequired || !role) {
    return children || <div>Access denied or role not provided</div>;
  }

  return <div>Access denied - Insufficient permissions</div>;
};

MyComponent.defaultProps = {
  children: 'Access denied - Insufficient permissions',
};

export default MyComponent;

// Function to check the user's role against the required role
// This function should be part of your security system
// For example, you can use a JWT token to store and verify the user's role
function checkRole(roleRequired: Role, token: string): Role | null {
  // Implement your security system logic here
  // ...
}

// Usage example
const token = 'your_jwt_token';
const role = checkRole('admin', token);

// Pass the user's role to MyComponent with a custom error message
<MyComponent roleRequired="admin" role={role} message="Welcome, admin!" children="Custom error message" />

In this updated version, I've added a `children` prop to allow for custom error messages. I've also added default props for the `children` prop in case it's not provided. This makes the component more flexible and accessible. Additionally, I've made the code more maintainable by separating the component's logic from the usage example.