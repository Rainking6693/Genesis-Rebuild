import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface RolePermissionsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  canEdit: boolean;
  canView: boolean;
  children?: ReactNode;
}

const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({
  message,
  canEdit,
  canView,
  className,
  role = 'alert',
  children,
  ...rest
}) => {
  if (!canView) {
    return null; // Prevent unauthorized access
  }

  const permissionClass = canEdit ? '' : 'read-only'; // Dynamically set read-only class

  return (
    <div
      className={`${permissionClass} ${className}`}
      role={role}
      {...rest}
    >
      {children || message} {/* Render message or allow for custom content */}
    </div>
  );
};

export default RolePermissionsComponent;

// Add null check for message prop
if (!canView || !message) {
  return null; // Prevent unauthorized access or rendering without message
}

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface RolePermissionsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  canEdit: boolean;
  canView: boolean;
  children?: ReactNode;
}

const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({
  message,
  canEdit,
  canView,
  className,
  role = 'alert',
  children,
  ...rest
}) => {
  if (!canView) {
    return null; // Prevent unauthorized access
  }

  const permissionClass = canEdit ? '' : 'read-only'; // Dynamically set read-only class

  return (
    <div
      className={`${permissionClass} ${className}`}
      role={role}
      {...rest}
    >
      {children || message} {/* Render message or allow for custom content */}
    </div>
  );
};

export default RolePermissionsComponent;

// Add null check for message prop
if (!canView || !message) {
  return null; // Prevent unauthorized access or rendering without message
}