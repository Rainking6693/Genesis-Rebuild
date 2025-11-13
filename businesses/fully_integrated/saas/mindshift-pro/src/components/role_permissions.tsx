import React, { createContext, useContext, useState } from 'react';

interface RolePermissions {
  role: string;
  permissions: string[];
}

interface RolePermissionsContextType {
  role: RolePermissions | null;
  hasRole: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasNonePermission: (permissions: string[]) => boolean;
  updateRole: (role: RolePermissions | null) => void;
}

const RolePermissionsContext = createContext<RolePermissionsContextType>({
  role: null,
  hasRole: () => false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  hasNonePermission: () => false,
  updateRole: () => {},
});

export const RolePermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RolePermissions | null>(null);

  const hasRole = () => role !== null;

  const hasPermission = (permission: string) => {
    if (!role) return false;
    return role.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!role) return false;
    return permissions.some((permission) => role.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]) => {
    if (!role) return false;
    return permissions.every((permission) => role.permissions.includes(permission));
  };

  const hasNonePermission = (permissions: string[]) => {
    if (!role) return false;
    return !permissions.some((permission) => role.permissions.includes(permission));
  };

  const updateRole = (newRole: RolePermissions | null) => {
    setRole(newRole);
  };

  return (
    <RolePermissionsContext.Provider value={{ role, hasRole, hasPermission, hasAnyPermission, hasAllPermissions, hasNonePermission, updateRole }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

export const useRolePermissions = () => useContext(RolePermissionsContext);

import React from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';

interface Props {
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { role } = useContext(RolePermissionsContext);

  if (!role) {
    return <div>Unauthorized access</div>;
  }

  return children;
};

export default MyComponent;

import React, { createContext, useContext, useState } from 'react';

interface RolePermissions {
  role: string;
  permissions: string[];
}

interface RolePermissionsContextType {
  role: RolePermissions | null;
  hasRole: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasNonePermission: (permissions: string[]) => boolean;
  updateRole: (role: RolePermissions | null) => void;
}

const RolePermissionsContext = createContext<RolePermissionsContextType>({
  role: null,
  hasRole: () => false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  hasNonePermission: () => false,
  updateRole: () => {},
});

export const RolePermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RolePermissions | null>(null);

  const hasRole = () => role !== null;

  const hasPermission = (permission: string) => {
    if (!role) return false;
    return role.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!role) return false;
    return permissions.some((permission) => role.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]) => {
    if (!role) return false;
    return permissions.every((permission) => role.permissions.includes(permission));
  };

  const hasNonePermission = (permissions: string[]) => {
    if (!role) return false;
    return !permissions.some((permission) => role.permissions.includes(permission));
  };

  const updateRole = (newRole: RolePermissions | null) => {
    setRole(newRole);
  };

  return (
    <RolePermissionsContext.Provider value={{ role, hasRole, hasPermission, hasAnyPermission, hasAllPermissions, hasNonePermission, updateRole }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

export const useRolePermissions = () => useContext(RolePermissionsContext);

import React from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';

interface Props {
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { role } = useContext(RolePermissionsContext);

  if (!role) {
    return <div>Unauthorized access</div>;
  }

  return children;
};

export default MyComponent;

MyComponent.tsx