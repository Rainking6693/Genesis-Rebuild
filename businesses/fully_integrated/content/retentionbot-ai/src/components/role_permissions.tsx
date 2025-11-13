import React from 'react';

interface Props {
  message: string;
  role?: string; // Add role prop to RetentionBotMessage for better accessibility and maintainability
}

// Rename this component to RetentionBotMessage
const RetentionBotMessage: React.FC<Props> = ({ message, role }) => {
  return <div role={`alert${role ? ` ${role}` : ""}`}>{message}</div>;
};

// Keep the original name for the other component
import MyComponent from './OtherComponent'; // Assuming it's imported from another file

// Add role-based permissions for RetentionBotMessage
const canViewRetentionBotMessage = (roles: string[] | null, requiredRole: string) => {
  // Implement your role-based access control logic here
  // For example, if only 'admin' role can view the RetentionBotMessage component:
  return roles?.includes(requiredRole);
};

const RetentionBotComponent: React.FC = () => {
  const [currentUserRoles, setCurrentUserRoles] = React.useState<string[] | null>(() => {
    // Get the current user's roles from your authentication system
    // This function should be replaced with the actual implementation
    return null;
  });

  const handleRoleChange = (roles: string[]) => {
    setCurrentUserRoles(roles);
  };

  React.useEffect(() => {
    // Check if the user has the required role on component mount
    if (canViewRetentionBotMessage(currentUserRoles, 'admin')) {
      handleRoleChange(['admin']);
    }
  }, []);

  if (currentUserRoles === null) {
    return <div>Loading...</div>;
  }

  return <RetentionBotMessage message="Your personalized re-engagement campaign" role={currentUserRoles[0]} />;
};

export default RetentionBotComponent;

import React from 'react';

interface Props {
  message: string;
  role?: string; // Add role prop to RetentionBotMessage for better accessibility and maintainability
}

// Rename this component to RetentionBotMessage
const RetentionBotMessage: React.FC<Props> = ({ message, role }) => {
  return <div role={`alert${role ? ` ${role}` : ""}`}>{message}</div>;
};

// Keep the original name for the other component
import MyComponent from './OtherComponent'; // Assuming it's imported from another file

// Add role-based permissions for RetentionBotMessage
const canViewRetentionBotMessage = (roles: string[] | null, requiredRole: string) => {
  // Implement your role-based access control logic here
  // For example, if only 'admin' role can view the RetentionBotMessage component:
  return roles?.includes(requiredRole);
};

const RetentionBotComponent: React.FC = () => {
  const [currentUserRoles, setCurrentUserRoles] = React.useState<string[] | null>(() => {
    // Get the current user's roles from your authentication system
    // This function should be replaced with the actual implementation
    return null;
  });

  const handleRoleChange = (roles: string[]) => {
    setCurrentUserRoles(roles);
  };

  React.useEffect(() => {
    // Check if the user has the required role on component mount
    if (canViewRetentionBotMessage(currentUserRoles, 'admin')) {
      handleRoleChange(['admin']);
    }
  }, []);

  if (currentUserRoles === null) {
    return <div>Loading...</div>;
  }

  return <RetentionBotMessage message="Your personalized re-engagement campaign" role={currentUserRoles[0]} />;
};

export default RetentionBotComponent;