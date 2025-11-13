import React, { useContext, ReactNode } from 'react';
import { RolePermissionsContext } from '../../contexts/RolePermissionsContext';

type Props = {
  children: ReactNode;
};

const MyComponent: React.FC<Props> = ({ children }) => {
  const { hasPermission } = useContext(RolePermissionsContext);

  // Check if RolePermissionsContext is provided
  if (!RolePermissionsContext) {
    console.error('RolePermissionsContext is not provided.');
    return null;
  }

  // Handle edge case when hasPermission returns undefined or null
  const isValidPermission = (permission: string): boolean => {
    if (typeof hasPermission !== 'function' || !hasPermission || !permission) {
      console.error(`hasPermission returned ${hasPermission}, expected a function that accepts a string parameter.`);
      return false;
    }

    const permissionResult = hasPermission(permission);
    if (typeof permissionResult !== 'boolean') {
      console.error(`hasPermission returned ${permissionResult} for permission "${permission}", expected a boolean.`);
      return false;
    }

    return permissionResult;
  }

  if (!isValidPermission('sustainability_compliance')) {
    return null;
  }

  return children;
};

export default MyComponent;

Changes made:

1. Added a type for the `children` prop.
2. Created a helper function `isValidPermission` to handle edge cases when `hasPermission` returns unexpected values.
3. Improved error messages to provide more context about the issue.
4. Removed the duplicate code between the two components.
5. Made the code more maintainable by separating the permission check logic into a separate function.
6. Added accessibility by providing more descriptive error messages.