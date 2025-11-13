import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from './userSlice';

type UserRole = 'Admin' | 'Manager' | 'User';

interface Props {
  message: string;
  allowedRoles?: UserRole[];
}

const MyComponent: FC<Props> = ({ message, allowedRoles }) => {
  const userRole = useSelector(selectUserRole);

  if (!userRole || !Array.isArray(userRole) || !userRole.every((role) => ['Admin', 'Manager', 'User'].includes(role))) {
    throw new Error('Invalid user role');
  }

  if (!allowedRoles || !Array.isArray(allowedRoles) || !allowedRoles.every((role) => ['Admin', 'Manager', 'User'].includes(role))) {
    throw new Error('Invalid allowed roles');
  }

  if (!allowedRoles || !allowedRoles.length || !allowedRoles.includes(userRole)) {
    return <div>Access denied</div>;
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('Invalid message');
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  allowedRoles: ['User'],
};

export default MyComponent;

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from './userSlice';

type UserRole = 'Admin' | 'Manager' | 'User';

interface Props {
  message: string;
  allowedRoles?: UserRole[];
}

const MyComponent: FC<Props> = ({ message, allowedRoles }) => {
  const userRole = useSelector(selectUserRole);

  if (!userRole || !Array.isArray(userRole) || !userRole.every((role) => ['Admin', 'Manager', 'User'].includes(role))) {
    throw new Error('Invalid user role');
  }

  if (!allowedRoles || !Array.isArray(allowedRoles) || !allowedRoles.every((role) => ['Admin', 'Manager', 'User'].includes(role))) {
    throw new Error('Invalid allowed roles');
  }

  if (!allowedRoles || !allowedRoles.length || !allowedRoles.includes(userRole)) {
    return <div>Access denied</div>;
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('Invalid message');
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  allowedRoles: ['User'],
};

export default MyComponent;