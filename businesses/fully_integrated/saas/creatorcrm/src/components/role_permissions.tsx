import React, { FC, ReactNode } from 'react';

interface RolePermissionsProps {
  id?: string; // Add an optional id for the component
  message: string;
  children?: ReactNode; // Allow for additional content within the component
  className?: string; // Allow for custom classes to be added
  testId?: string; // Use testId instead of data-testid for better accessibility
}

const RolePermissions: FC<RolePermissionsProps> = ({
  id,
  message,
  children,
  className,
  testId,
}) => {
  return (
    <div
      className={className}
      data-testid={testId || 'role-permissions'} // Use a more descriptive testId
    >
      {message}
      {children}
    </div>
  );
};

// Import the component
export default RolePermissions;

In this updated code, I've renamed the component to `RolePermissions` for better readability. I've also used a more descriptive `testId` for better accessibility. Additionally, I've added some type safety by using the `FC` type for the functional component and specifying the `RolePermissionsProps` type for its props.