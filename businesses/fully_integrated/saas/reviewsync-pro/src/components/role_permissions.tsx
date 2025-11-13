import React, { FunctionComponent, ReactNode } from 'react';
import { RoleBasedPermissions } from './RoleBasedPermissions'; // Assuming RoleBasedPermissions is a module for handling permissions

type Props = {
  message: string;
  permissions: RoleBasedPermissions; // Adding permissions as a prop for role-based access control
  fallback?: ReactNode; // Optional fallback content to display when the user does not have the necessary permissions
  children?: ReactNode; // Optional content to display when the user has the necessary permissions
};

const FunctionalComponent: FunctionComponent<Props> = ({
  message,
  permissions,
  fallback = <div>You do not have the necessary permissions to view this content.</div>,
  children,
}) => {
  // Check if the user has the necessary permissions before displaying the message or children
  if (permissions.canViewReviews) {
    return children || <div>{message}</div>; // Display the message if children are not provided, otherwise display the provided children
  }

  return fallback; // Return the fallback content if the user does not have the necessary permissions
};

FunctionalComponent.defaultProps = {
  children: undefined,
};

export default FunctionalComponent;

import React, { FunctionComponent, ReactNode } from 'react';
import { RoleBasedPermissions } from './RoleBasedPermissions'; // Assuming RoleBasedPermissions is a module for handling permissions

type Props = {
  message: string;
  permissions: RoleBasedPermissions; // Adding permissions as a prop for role-based access control
  fallback?: ReactNode; // Optional fallback content to display when the user does not have the necessary permissions
  children?: ReactNode; // Optional content to display when the user has the necessary permissions
};

const FunctionalComponent: FunctionComponent<Props> = ({
  message,
  permissions,
  fallback = <div>You do not have the necessary permissions to view this content.</div>,
  children,
}) => {
  // Check if the user has the necessary permissions before displaying the message or children
  if (permissions.canViewReviews) {
    return children || <div>{message}</div>; // Display the message if children are not provided, otherwise display the provided children
  }

  return fallback; // Return the fallback content if the user does not have the necessary permissions
};

FunctionalComponent.defaultProps = {
  children: undefined,
};

export default FunctionalComponent;