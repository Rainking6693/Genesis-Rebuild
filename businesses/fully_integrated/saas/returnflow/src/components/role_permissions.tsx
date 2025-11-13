import React, { useState, useEffect } from 'react';

interface Permission {
  name: string;
  enabled: boolean;
}

interface RolePermissionsProps {
  title: string;
  permissions: Permission[];
  onPermissionsChange?: (updatedPermissions: Permission[]) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  title,
  permissions: initialPermissions,
  onPermissionsChange,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

  useEffect(() => {
    setPermissions(initialPermissions);
  }, [initialPermissions]);

  const handlePermissionToggle = (index: number) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index].enabled = !updatedPermissions[index].enabled;
    setPermissions(updatedPermissions);
    onPermissionsChange?.(updatedPermissions);
  };

  return (
    <div>
      <h1>{title}</h1>
      <table aria-label="Role Permissions" className="role-permissions-table">
        <thead>
          <tr>
            <th scope="col">Permission</th>
            <th scope="col">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map(({ name, enabled }, index) => (
            <tr key={name} className="role-permissions-row">
              <td>{name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handlePermissionToggle(index)}
                  aria-label={`${name} permission`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect } from 'react';

interface Permission {
  name: string;
  enabled: boolean;
}

interface RolePermissionsProps {
  title: string;
  permissions: Permission[];
  onPermissionsChange?: (updatedPermissions: Permission[]) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  title,
  permissions: initialPermissions,
  onPermissionsChange,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

  useEffect(() => {
    setPermissions(initialPermissions);
  }, [initialPermissions]);

  const handlePermissionToggle = (index: number) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index].enabled = !updatedPermissions[index].enabled;
    setPermissions(updatedPermissions);
    onPermissionsChange?.(updatedPermissions);
  };

  return (
    <div>
      <h1>{title}</h1>
      <table aria-label="Role Permissions" className="role-permissions-table">
        <thead>
          <tr>
            <th scope="col">Permission</th>
            <th scope="col">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map(({ name, enabled }, index) => (
            <tr key={name} className="role-permissions-row">
              <td>{name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handlePermissionToggle(index)}
                  aria-label={`${name} permission`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissions;