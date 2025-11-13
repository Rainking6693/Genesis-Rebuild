import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './auth-context';
import { RolePermission, UserRole } from './types';

interface RolePermissionsProps {
  roles: UserRole[];
  permissions: RolePermission[];
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ roles, permissions }) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<RolePermission[]>([]);

  // Memoize the user's permissions to avoid unnecessary re-renders
  const memoizedUserPermissions = useMemo(() => {
    const userRoles = roles.filter((role) => user.roles.includes(role.name));
    const userPermissionsSet = new Set<RolePermission>();
    userRoles.forEach((role) => {
      role.permissions.forEach((permission) => userPermissionsSet.add(permission));
    });
    return Array.from(userPermissionsSet);
  }, [roles, permissions, user.roles]);

  useEffect(() => {
    setUserPermissions(memoizedUserPermissions);
  }, [memoizedUserPermissions]);

  // Ensure the component is accessible by adding ARIA attributes
  return (
    <div role="region" aria-live="polite">
      <h2>User Permissions</h2>
      {userPermissions.length > 0 ? (
        <ul aria-label="User permissions">
          {userPermissions.map((permission) => (
            <li key={permission.name} aria-label={permission.name}>
              {permission.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No permissions found for the user.</p>
      )}
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './auth-context';
import { RolePermission, UserRole } from './types';

interface RolePermissionsProps {
  roles: UserRole[];
  permissions: RolePermission[];
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ roles, permissions }) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<RolePermission[]>([]);

  // Memoize the user's permissions to avoid unnecessary re-renders
  const memoizedUserPermissions = useMemo(() => {
    const userRoles = roles.filter((role) => user.roles.includes(role.name));
    const userPermissionsSet = new Set<RolePermission>();
    userRoles.forEach((role) => {
      role.permissions.forEach((permission) => userPermissionsSet.add(permission));
    });
    return Array.from(userPermissionsSet);
  }, [roles, permissions, user.roles]);

  useEffect(() => {
    setUserPermissions(memoizedUserPermissions);
  }, [memoizedUserPermissions]);

  // Ensure the component is accessible by adding ARIA attributes
  return (
    <div role="region" aria-live="polite">
      <h2>User Permissions</h2>
      {userPermissions.length > 0 ? (
        <ul aria-label="User permissions">
          {userPermissions.map((permission) => (
            <li key={permission.name} aria-label={permission.name}>
              {permission.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No permissions found for the user.</p>
      )}
    </div>
  );
};

export default RolePermissions;