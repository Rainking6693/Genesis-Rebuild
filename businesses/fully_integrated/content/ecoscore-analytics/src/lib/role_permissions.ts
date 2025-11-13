import React, { useContext } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type ComponentProps<T> = T;
type ComponentType<T> = React.FC<T>;

interface WithRolePermissionsProps<T> {
  children: React.ReactElement<T>;
}

function WithRolePermissions<T>(Component: ComponentType<T>) {
  return function WrappedComponent(props: WithRolePermissionsProps<T>) {
    const { hasPermission } = useContext(RolePermissionsContext);

    if (!hasPermission('sustainability_analytics')) {
      return <div>Unauthorized access</div>;
    }

    return <Component {...(props as ComponentProps<T>)} />;
  };
}

// Define your component interfaces
interface MyComponentProps {
  message: string;
}

interface OtherComponentProps {
  // Define props for OtherComponent here
}

// Define your functional components
const MyComponent: React.FC<MyComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

// Define OtherComponent here with its props

// Protect your components using the WithRolePermissions HOC
const ProtectedMyComponent = WithRolePermissions(MyComponent);

// For other components
const ProtectedOtherComponent = WithRolePermissions(OtherComponent);

export { ProtectedMyComponent, ProtectedOtherComponent };

import React, { useContext } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type ComponentProps<T> = T;
type ComponentType<T> = React.FC<T>;

interface WithRolePermissionsProps<T> {
  children: React.ReactElement<T>;
}

function WithRolePermissions<T>(Component: ComponentType<T>) {
  return function WrappedComponent(props: WithRolePermissionsProps<T>) {
    const { hasPermission } = useContext(RolePermissionsContext);

    if (!hasPermission('sustainability_analytics')) {
      return <div>Unauthorized access</div>;
    }

    return <Component {...(props as ComponentProps<T>)} />;
  };
}

// Define your component interfaces
interface MyComponentProps {
  message: string;
}

interface OtherComponentProps {
  // Define props for OtherComponent here
}

// Define your functional components
const MyComponent: React.FC<MyComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

// Define OtherComponent here with its props

// Protect your components using the WithRolePermissions HOC
const ProtectedMyComponent = WithRolePermissions(MyComponent);

// For other components
const ProtectedOtherComponent = WithRolePermissions(OtherComponent);

export { ProtectedMyComponent, ProtectedOtherComponent };