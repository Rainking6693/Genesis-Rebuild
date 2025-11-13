import React, { FC, ReactNode } from 'react';

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

interface RolePermissionsProps {
  role?: Role | null;
  permissions?: Permission[] | null;
  errorMessage?: string;
  children?: ReactNode;
}

const RolePermissionsComponent: FC<RolePermissionsProps> = ({ role, permissions, errorMessage, children }) => {
  if (errorMessage) {
    return (
      <div className="error-message">
        {errorMessage}
        {children}
      </div>
    );
  }

  if (!role || !permissions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {role && <h2>Role: {role.name}</h2>}
      {permissions && (
        <ul>
          {permissions.map((permission) => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
};

export default RolePermissionsComponent;

import React, { FC, ReactNode } from 'react';

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

interface RolePermissionsProps {
  role?: Role | null;
  permissions?: Permission[] | null;
  errorMessage?: string;
  children?: ReactNode;
}

const RolePermissionsComponent: FC<RolePermissionsProps> = ({ role, permissions, errorMessage, children }) => {
  if (errorMessage) {
    return (
      <div className="error-message">
        {errorMessage}
        {children}
      </div>
    );
  }

  if (!role || !permissions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {role && <h2>Role: {role.name}</h2>}
      {permissions && (
        <ul>
          {permissions.map((permission) => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
};

export default RolePermissionsComponent;