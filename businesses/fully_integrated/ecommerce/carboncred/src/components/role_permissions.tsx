import { createContext, useState } from 'react';

interface RolePermissions {
  [key: string]: boolean;
}

interface RolePermissionsContextType {
  hasPermission: (permission: string) => boolean;
  addPermission: (permission: string) => void;
  removePermission: (permission: string) => void;
}

const RolePermissionsContext = createContext<RolePermissionsContextType>({
  hasPermission: () => false,
  addPermission: () => {},
  removePermission: () => {},
});

export const RolePermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<RolePermissions>({});

  const hasPermission = (permission: string) => {
    return permissions[permission] || false;
  };

  const addPermission = (permission: string) => {
    setPermissions((prevPermissions) => ({ ...prevPermissions, [permission]: true }));
  };

  const removePermission = (permission: string) => {
    setPermissions((prevPermissions) => ({ ...prevPermissions, [permission]: false }));
  };

  const checkAllPermissions = (permissionsToCheck: string[]) => {
    return permissionsToCheck.every((permission) => hasPermission(permission));
  };

  return (
    <RolePermissionsContext.Provider value={{ hasPermission, addPermission, removePermission, checkAllPermissions }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

import React from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';

interface Props {
  permissionsToCheck: string[];
  children: JSX.Element;
}

const MyComponent: React.FC<Props> = ({ permissionsToCheck, children }) => {
  const { hasPermission, checkAllPermissions } = React.useContext(RolePermissionsContext);

  if (!checkAllPermissions(permissionsToCheck)) {
    return <div data-testid="permission-denied">Permission denied</div>; // Provide a testable error message
  }

  return children;
};

export default MyComponent;

import { createContext, useState } from 'react';

interface RolePermissions {
  [key: string]: boolean;
}

interface RolePermissionsContextType {
  hasPermission: (permission: string) => boolean;
  addPermission: (permission: string) => void;
  removePermission: (permission: string) => void;
}

const RolePermissionsContext = createContext<RolePermissionsContextType>({
  hasPermission: () => false,
  addPermission: () => {},
  removePermission: () => {},
});

export const RolePermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<RolePermissions>({});

  const hasPermission = (permission: string) => {
    return permissions[permission] || false;
  };

  const addPermission = (permission: string) => {
    setPermissions((prevPermissions) => ({ ...prevPermissions, [permission]: true }));
  };

  const removePermission = (permission: string) => {
    setPermissions((prevPermissions) => ({ ...prevPermissions, [permission]: false }));
  };

  const checkAllPermissions = (permissionsToCheck: string[]) => {
    return permissionsToCheck.every((permission) => hasPermission(permission));
  };

  return (
    <RolePermissionsContext.Provider value={{ hasPermission, addPermission, removePermission, checkAllPermissions }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

import React from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';

interface Props {
  permissionsToCheck: string[];
  children: JSX.Element;
}

const MyComponent: React.FC<Props> = ({ permissionsToCheck, children }) => {
  const { hasPermission, checkAllPermissions } = React.useContext(RolePermissionsContext);

  if (!checkAllPermissions(permissionsToCheck)) {
    return <div data-testid="permission-denied">Permission denied</div>; // Provide a testable error message
  }

  return children;
};

export default MyComponent;