import React, { ReactNode, useContext } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Props<T> = T & { children: ReactNode };

const WithRolePermissions = <T extends {}>(Component: React.FC<T>) => {
  return (props: Props<T>) => {
    const { hasPermission } = useContext(RolePermissionsContext);

    if (!hasPermission) {
      return (
        <div data-testid="access-denied" role="alert">
          Access denied. Please contact the administrator.
        </div>
      );
    }

    return <Component {...props} />;
  };
};

interface ComponentProps {
  message: string;
}

const MyComponent: React.FC<ComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

const RolePermissionsWrappedMyComponent = WithRolePermissions(MyComponent);

export default RolePermissionsWrappedMyComponent;

import React, { ReactNode, useContext } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Props<T> = T & { children: ReactNode };

const WithRolePermissions = <T extends {}>(Component: React.FC<T>) => {
  return (props: Props<T>) => {
    const { hasPermission } = useContext(RolePermissionsContext);

    if (!hasPermission) {
      return (
        <div data-testid="access-denied" role="alert">
          Access denied. Please contact the administrator.
        </div>
      );
    }

    return <Component {...props} />;
  };
};

interface ComponentProps {
  message: string;
}

const MyComponent: React.FC<ComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

const RolePermissionsWrappedMyComponent = WithRolePermissions(MyComponent);

export default RolePermissionsWrappedMyComponent;