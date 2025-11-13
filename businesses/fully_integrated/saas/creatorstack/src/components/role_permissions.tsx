import React, { FC, ReactNode } from 'react';

interface RolePermissionsProps {
  role: string;
  permissions: string[];
  children: ReactNode;
  errorMessage?: string;
}

const RolePermissions: FC<RolePermissionsProps> = ({
  role,
  permissions,
  children,
  errorMessage = "You do not have the necessary permissions to access this content.",
}) => {
  if (!role || !permissions || permissions.length === 0) {
    return null;
  }

  const hasAllPermissions = permissions.every(permission =>
    role.toLowerCase().includes(permission.toLowerCase())
  );

  return hasAllPermissions ? (
    <div className="role-permissions">
      {children}
    </div>
  ) : (
    <div className="role-permissions role-permissions--denied">
      <p>{errorMessage}</p>
    </div>
  );
};

export default RolePermissions;

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  return <div>{message}</div>;
};

export default MessageDisplay;

In this updated code, I've added a `RolePermissions` component that takes in a `role`, `permissions`, `children`, and an optional `errorMessage` prop. The component checks if the role and permissions are provided and if the role has all the necessary permissions. If the role has all the permissions, it renders the children; otherwise, it displays the provided error message.

I've also added a CSS class to the error message for better styling and accessibility. Additionally, I've imported `ReactNode` to handle any type of child elements, not just strings.

Lastly, I've renamed the original `MyComponent` to `MessageDisplay` to better reflect its purpose.