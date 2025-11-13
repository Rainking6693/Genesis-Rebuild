import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface RolePermissionsMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const RolePermissionsMessage: React.FC<RolePermissionsMessageProps> = ({ message, className, ...rest }) => {
  return (
    <div className={`role-permissions-message ${className}`} {...rest}>
      <p>{message}</p>
    </div>
  );
};

RolePermissionsMessage.defaultProps = {
  className: '',
};

export { RolePermissionsMessage };

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface RolePermissionsMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const RolePermissionsMessage: React.FC<RolePermissionsMessageProps> = ({ message, className, ...rest }) => {
  return (
    <div className={`role-permissions-message ${className}`} {...rest}>
      <p>{message}</p>
    </div>
  );
};

RolePermissionsMessage.defaultProps = {
  className: '',
};

export { RolePermissionsMessage };