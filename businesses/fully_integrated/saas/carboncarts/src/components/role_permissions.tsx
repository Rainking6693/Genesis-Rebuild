import React, { FC, ReactNode } from 'react';

interface Props {
  role: string | null;
  permissions: string[] | null;
  children: ReactNode;
}

const RolePermissions: FC<Props> = ({ role, permissions, children }) => {
  if (!role || !permissions || permissions.length === 0) {
    return null;
  }

  // Check if role and permissions are valid strings
  if (!Array.isArray(permissions) || permissions.some((permission) => typeof permission !== 'string')) {
    return <div className="role-permissions role-permissions--error">
      <p>Invalid permissions provided.</p>
    </div>;
  }

  // Check if role is a valid string
  if (typeof role !== 'string') {
    return <div className="role-permissions role-permissions--error">
      <p>Invalid role provided.</p>
    </div>;
  }

  const hasAllPermissions = permissions.every((permission) =>
    role.toLowerCase().includes(permission.toLowerCase())
  );

  return hasAllPermissions ? (
    <div className="role-permissions">
      {children}
    </div>
  ) : (
    <div className="role-permissions role-permissions--denied">
      <p>You do not have the required permissions to access this content.</p>
    </div>
  );
};

export default RolePermissions;

import React, { FC, ReactNode } from 'react';

interface Props {
  role: string | null;
  permissions: string[] | null;
  children: ReactNode;
}

const RolePermissions: FC<Props> = ({ role, permissions, children }) => {
  if (!role || !permissions || permissions.length === 0) {
    return null;
  }

  // Check if role and permissions are valid strings
  if (!Array.isArray(permissions) || permissions.some((permission) => typeof permission !== 'string')) {
    return <div className="role-permissions role-permissions--error">
      <p>Invalid permissions provided.</p>
    </div>;
  }

  // Check if role is a valid string
  if (typeof role !== 'string') {
    return <div className="role-permissions role-permissions--error">
      <p>Invalid role provided.</p>
    </div>;
  }

  const hasAllPermissions = permissions.every((permission) =>
    role.toLowerCase().includes(permission.toLowerCase())
  );

  return hasAllPermissions ? (
    <div className="role-permissions">
      {children}
    </div>
  ) : (
    <div className="role-permissions role-permissions--denied">
      <p>You do not have the required permissions to access this content.</p>
    </div>
  );
};

export default RolePermissions;