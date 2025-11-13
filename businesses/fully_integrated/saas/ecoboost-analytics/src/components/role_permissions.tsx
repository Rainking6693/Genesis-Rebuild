import { createContext, useState, ReactNode } from 'react';

interface RolePermissions {
  viewAnalytics: boolean;
  manageAnalytics: boolean;
  // Add more roles as needed
}

interface RolePermissionsContextType {
  hasPermission: (role: keyof RolePermissions) => boolean;
  loadPermissions: (permissions: RolePermissions) => void;
}

const RolePermissionsContext = createContext<RolePermissionsContextType>({
  hasPermission: () => false,
  loadPermissions: () => {},
});

RolePermissionsContext.displayName = 'RolePermissionsContext';

const RolePermissionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<RolePermissions>({
    viewAnalytics: false,
    manageAnalytics: false,
    // Add more roles as needed
    // Initialize permissions with a default value to handle cases where they are not yet loaded
    ...{ viewAnalytics: false, manageAnalytics: false },
  });

  const hasPermission = (role: keyof RolePermissions) => permissions[role];

  const loadPermissions = (newPermissions: RolePermissions) => {
    setPermissions(newPermissions);
  };

  return (
    <RolePermissionsContext.Provider value={{ hasPermission, loadPermissions }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

export { RolePermissionsContext, RolePermissionsProvider };

import React, { useContext } from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';

type UseRolePermissionsResult = {
  hasPermission: (role: keyof RolePermissions) => boolean;
};

export const useRolePermissions = (): UseRolePermissionsResult => {
  const context = React.useContext(RolePermissionsContext);

  if (!context) {
    throw new Error('useRolePermissions must be used within a RolePermissionsProvider');
  }

  return {
    hasPermission: (role: keyof RolePermissions) => context.hasPermission(role),
  };
};

import React from 'react';
import { RolePermissionsContext } from './RolePermissionsContext';
import { useRolePermissions } from './useRolePermissions';

interface Props {
  children: JSX.Element;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { hasPermission } = useRolePermissions();

  if (!hasPermission('view-analytics')) {
    return <div data-testid="unauthorized-access">Unauthorized access</div>;
  }

  return children;
};

MyComponent.displayName = 'MyComponent';
MyComponent.defaultProps = {
  children: null,
};

export default MyComponent;

In this version, I've added type safety to the custom hook's return type, improved error handling by providing a more descriptive error message, and added a `data-testid` attribute to the unauthorized access message for testing purposes. I've also added a `displayName` and `defaultProps` to the `MyComponent` component for better accessibility and maintainability.