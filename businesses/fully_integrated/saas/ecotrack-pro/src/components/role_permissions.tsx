import React, { useEffect, useState } from 'react';
import { IRole, RoleService } from '../../services/RoleService';

interface Props {
  userId: string;
}

const MyComponent: React.FC<Props> = ({ userId }) => {
  const [role, setRole] = useState<IRole | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleData = await RoleService.getRoleByUserId(userId);
        setRole(roleData);
      } catch (error) {
        setError(error);
      }
    };

    fetchRole();
  }, [userId]);

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred while fetching the role:</p>
        <p role="msg">{error.message}</p>
      </div>
    );
  }

  if (!role) {
    return <div role="status">Loading...</div>;
  }

  return (
    <div>
      <h2>Role Permissions for User ID: {userId}</h2>
      <ul role="list">
        {Object.keys(role.permissions).map((permission) => (
          <li key={permission} role="listitem">
            {permission}: {role.permissions[permission]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { IRole, RoleService } from '../../services/RoleService';

interface Props {
  userId: string;
}

const MyComponent: React.FC<Props> = ({ userId }) => {
  const [role, setRole] = useState<IRole | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleData = await RoleService.getRoleByUserId(userId);
        setRole(roleData);
      } catch (error) {
        setError(error);
      }
    };

    fetchRole();
  }, [userId]);

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred while fetching the role:</p>
        <p role="msg">{error.message}</p>
      </div>
    );
  }

  if (!role) {
    return <div role="status">Loading...</div>;
  }

  return (
    <div>
      <h2>Role Permissions for User ID: {userId}</h2>
      <ul role="list">
        {Object.keys(role.permissions).map((permission) => (
          <li key={permission} role="listitem">
            {permission}: {role.permissions[permission]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;