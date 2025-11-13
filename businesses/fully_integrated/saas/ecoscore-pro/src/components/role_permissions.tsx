import React, { useContext, useEffect } from 'react';
import { RolePermissionsContext, RolePermissionsContextValue } from '../../contexts/RolePermissionsContext';

interface Props<T> {
  children: T;
}

const MyComponent: React.FC<Props<JSX.Element>> = ({ children }) => {
  const { hasPermission, isLoading, error } = useContext(RolePermissionsContext) as RolePermissionsContextValue;

  useEffect(() => {
    if (!hasPermission('view_sustainability_data') && !isLoading) {
      throw new Error('Unauthorized access');
    }
  }, [hasPermission, isLoading]);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return children;
};

export default MyComponent;

import React, { useContext, useEffect } from 'react';
import { RolePermissionsContext, RolePermissionsContextValue } from '../../contexts/RolePermissionsContext';

interface Props<T> {
  children: T;
}

const MyComponent: React.FC<Props<JSX.Element>> = ({ children }) => {
  const { hasPermission, isLoading, error } = useContext(RolePermissionsContext) as RolePermissionsContextValue;

  useEffect(() => {
    if (!hasPermission('view_sustainability_data') && !isLoading) {
      throw new Error('Unauthorized access');
    }
  }, [hasPermission, isLoading]);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return children;
};

export default MyComponent;