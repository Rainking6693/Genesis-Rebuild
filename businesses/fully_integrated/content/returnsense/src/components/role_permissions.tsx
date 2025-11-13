import React, { useContext, ReactNode } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Props = {
  message: ReactNode;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const { hasPermission } = useContext(RolePermissionsContext);

  // Check if RolePermissionsContext is available before using it
  if (!RolePermissionsContext) {
    console.error('RolePermissionsContext is not available. Please ensure it is properly imported and initialized.');
    return null;
  }

  // Handle the case when hasPermission returns undefined, null, or any other non-boolean value
  if (typeof hasPermission !== 'boolean') {
    console.error(`hasPermission function returned an unexpected value. Expected a boolean. Received: ${JSON.stringify(hasPermission)}`);
    return null;
  }

  // Add a default value for hasPermission to handle the case when the user doesn't have the required permission
  const hasRequiredPermission = hasPermission('view_return_data') || false;

  if (!hasRequiredPermission) {
    return null;
  }

  return <div>{message}</div>;
};

export default MyComponent;

import React, { useContext, ReactNode } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Props = {
  message: ReactNode;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const { hasPermission } = useContext(RolePermissionsContext);

  // Check if RolePermissionsContext is available before using it
  if (!RolePermissionsContext) {
    console.error('RolePermissionsContext is not available. Please ensure it is properly imported and initialized.');
    return null;
  }

  // Handle the case when hasPermission returns undefined, null, or any other non-boolean value
  if (typeof hasPermission !== 'boolean') {
    console.error(`hasPermission function returned an unexpected value. Expected a boolean. Received: ${JSON.stringify(hasPermission)}`);
    return null;
  }

  // Add a default value for hasPermission to handle the case when the user doesn't have the required permission
  const hasRequiredPermission = hasPermission('view_return_data') || false;

  if (!hasRequiredPermission) {
    return null;
  }

  return <div>{message}</div>;
};

export default MyComponent;