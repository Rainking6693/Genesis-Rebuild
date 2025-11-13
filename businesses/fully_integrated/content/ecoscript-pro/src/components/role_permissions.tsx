import React, { useState, useEffect } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Props {
  userRole: Role;
  message: string;
  children?: React.ReactNode;
}

const defaultProps = {
  message: 'Default message',
};

const MyComponent: React.FC<Props> = ({ userRole, message, children }) => {
  const [roleErrorMessage, setRoleErrorMessage] = useState('');

  const getAccessibleMessage = () => {
    if (isValidUserRole(userRole)) {
      return message;
    }
    return 'Access denied';
  };

  const getRoleErrorMessage = () => {
    return `Access denied for role: ${userRole}`;
  };

  const roleErrorMessageId = 'role-error-message';

  const getRoleErrorMessageElement = () => {
    if (roleErrorMessage) {
      return (
        <div id={roleErrorMessageId} role="alert">
          {roleErrorMessage}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setRoleErrorMessage(getRoleErrorMessage());
  }, [userRole]);

  return (
    <>
      {getRoleErrorMessageElement()}
      <div>
        {children}
        {getAccessibleMessage()}
      </div>
    </>
  );
};

MyComponent.defaultProps = defaultProps;

const allowedRoles: Record<Role, Role[]> = {
  admin: ['admin', 'editor'],
  editor: ['editor'],
  viewer: [], // By default, viewer role has no access to this component
};

function isValidUserRole(userRole: Role): boolean {
  return allowedRoles[userRole].includes(userRole);
}

export default MyComponent;

import React, { useState, useEffect } from 'react';

type Role = 'admin' | 'editor' | 'viewer';

interface Props {
  userRole: Role;
  message: string;
  children?: React.ReactNode;
}

const defaultProps = {
  message: 'Default message',
};

const MyComponent: React.FC<Props> = ({ userRole, message, children }) => {
  const [roleErrorMessage, setRoleErrorMessage] = useState('');

  const getAccessibleMessage = () => {
    if (isValidUserRole(userRole)) {
      return message;
    }
    return 'Access denied';
  };

  const getRoleErrorMessage = () => {
    return `Access denied for role: ${userRole}`;
  };

  const roleErrorMessageId = 'role-error-message';

  const getRoleErrorMessageElement = () => {
    if (roleErrorMessage) {
      return (
        <div id={roleErrorMessageId} role="alert">
          {roleErrorMessage}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setRoleErrorMessage(getRoleErrorMessage());
  }, [userRole]);

  return (
    <>
      {getRoleErrorMessageElement()}
      <div>
        {children}
        {getAccessibleMessage()}
      </div>
    </>
  );
};

MyComponent.defaultProps = defaultProps;

const allowedRoles: Record<Role, Role[]> = {
  admin: ['admin', 'editor'],
  editor: ['editor'],
  viewer: [], // By default, viewer role has no access to this component
};

function isValidUserRole(userRole: Role): boolean {
  return allowedRoles[userRole].includes(userRole);
}

export default MyComponent;