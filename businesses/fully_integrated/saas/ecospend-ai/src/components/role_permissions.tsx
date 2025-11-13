import React, { useContext, ReactNode } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Role = 'admin' | 'finance_manager' | 'other_role';

type ComponentProps<T> = T extends React.FC<infer P> ? P : never;

const withRolePermissions = <T extends React.FC<any>>(Component: T) => {
  return (props: React.PropsWithChildren<ComponentProps<T>>) => {
    const { hasRole } = useContext(RolePermissionsContext);
    const allowedRoles: Role[] = ['admin', 'finance_manager'];

    if (!allowedRoles.includes(hasRole())) {
      return <div>Unauthorized access</div>;
    }

    return <Component {...props} />;
  };
};

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return <div>{message}</div>;
};

const RolePermissionsWrappedComponent = withRolePermissions(MyComponent);

export default RolePermissionsWrappedComponent;

import React, { useContext, ReactNode } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Role = 'admin' | 'finance_manager' | 'other_role';

type ComponentProps<T> = T extends React.FC<infer P> ? P : never;

const withRolePermissions = <T extends React.FC<any>>(Component: T) => {
  return (props: React.PropsWithChildren<ComponentProps<T>>) => {
    const { hasRole } = useContext(RolePermissionsContext);
    const allowedRoles: Role[] = ['admin', 'finance_manager'];

    if (!allowedRoles.includes(hasRole())) {
      return <div>Unauthorized access</div>;
    }

    return <Component {...props} />;
  };
};

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return <div>{message}</div>;
};

const RolePermissionsWrappedComponent = withRolePermissions(MyComponent);

export default RolePermissionsWrappedComponent;