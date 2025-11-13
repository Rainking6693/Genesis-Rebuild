import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionsProps {
  roles: RolePermission[];
  selectedRoleId: string;
  onRoleSelect: (roleId: string) => void;
  onPermissionChange: (roleId: string, permissions: string[]) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = memo(
  ({ roles, selectedRoleId, onRoleSelect, onPermissionChange }) => {
    const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    useEffect(() => {
      const role = roles.find((r) => r.id === selectedRoleId);
      setSelectedRole(role || null);
      setSelectedPermissions(role?.permissions || []);
    }, [roles, selectedRoleId]);

    const handleRoleSelect = useCallback(
      (roleId: string) => {
        onRoleSelect(roleId);
      },
      [onRoleSelect]
    );

    const handlePermissionChange = useCallback(
      (permission: string) => {
        const newPermissions = selectedPermissions.includes(permission)
          ? selectedPermissions.filter((p) => p !== permission)
          : [...selectedPermissions, permission];
        setSelectedPermissions(newPermissions);
        onPermissionChange(selectedRole?.id || '', newPermissions);
      },
      [selectedPermissions, selectedRole, onPermissionChange]
    );

    const roleOptions = useMemo(
      () =>
        roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        )),
      [roles]
    );

    const permissionCheckboxes = useMemo(
      () =>
        (selectedRole?.permissions || []).map((permission) => (
          <div key={permission}>
            <input
              type="checkbox"
              id={`permission-${permission}`}
              checked={selectedPermissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)}
              aria-label={permission}
            />
            <label htmlFor={`permission-${permission}`}>{permission}</label>
          </div>
        )),
      [selectedRole, selectedPermissions, handlePermissionChange]
    );

    return (
      <div data-testid="role-permissions">
        <label htmlFor="role-select">Select a role:</label>
        <select
          id="role-select"
          value={selectedRoleId}
          onChange={(e) => handleRoleSelect(e.target.value)}
          aria-label="Select a role"
        >
          <option value="">Select a role</option>
          {roleOptions}
        </select>

        {selectedRole && (
          <div>
            <h2>{selectedRole.name}</h2>
            <p>{selectedRole.description}</p>
            <h3>Permissions:</h3>
            {permissionCheckboxes.length > 0 ? (
              permissionCheckboxes
            ) : (
              <p>No permissions available for the selected role.</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default RolePermissions;

import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionsProps {
  roles: RolePermission[];
  selectedRoleId: string;
  onRoleSelect: (roleId: string) => void;
  onPermissionChange: (roleId: string, permissions: string[]) => void;
}

const RolePermissions: React.FC<RolePermissionsProps> = memo(
  ({ roles, selectedRoleId, onRoleSelect, onPermissionChange }) => {
    const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    useEffect(() => {
      const role = roles.find((r) => r.id === selectedRoleId);
      setSelectedRole(role || null);
      setSelectedPermissions(role?.permissions || []);
    }, [roles, selectedRoleId]);

    const handleRoleSelect = useCallback(
      (roleId: string) => {
        onRoleSelect(roleId);
      },
      [onRoleSelect]
    );

    const handlePermissionChange = useCallback(
      (permission: string) => {
        const newPermissions = selectedPermissions.includes(permission)
          ? selectedPermissions.filter((p) => p !== permission)
          : [...selectedPermissions, permission];
        setSelectedPermissions(newPermissions);
        onPermissionChange(selectedRole?.id || '', newPermissions);
      },
      [selectedPermissions, selectedRole, onPermissionChange]
    );

    const roleOptions = useMemo(
      () =>
        roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        )),
      [roles]
    );

    const permissionCheckboxes = useMemo(
      () =>
        (selectedRole?.permissions || []).map((permission) => (
          <div key={permission}>
            <input
              type="checkbox"
              id={`permission-${permission}`}
              checked={selectedPermissions.includes(permission)}
              onChange={() => handlePermissionChange(permission)}
              aria-label={permission}
            />
            <label htmlFor={`permission-${permission}`}>{permission}</label>
          </div>
        )),
      [selectedRole, selectedPermissions, handlePermissionChange]
    );

    return (
      <div data-testid="role-permissions">
        <label htmlFor="role-select">Select a role:</label>
        <select
          id="role-select"
          value={selectedRoleId}
          onChange={(e) => handleRoleSelect(e.target.value)}
          aria-label="Select a role"
        >
          <option value="">Select a role</option>
          {roleOptions}
        </select>

        {selectedRole && (
          <div>
            <h2>{selectedRole.name}</h2>
            <p>{selectedRole.description}</p>
            <h3>Permissions:</h3>
            {permissionCheckboxes.length > 0 ? (
              permissionCheckboxes
            ) : (
              <p>No permissions available for the selected role.</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default RolePermissions;