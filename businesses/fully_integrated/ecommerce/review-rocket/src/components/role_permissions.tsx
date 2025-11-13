import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
  const [newPermission, setNewPermission] = useState('');
  const [error, setError] = useState<string | null>(null);
  const newPermissionInputRef = useRef<HTMLInputElement>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching role permissions: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  const handleRoleSelect = (role: RolePermission) => {
    setSelectedRole(role);
  };

  const handleAddPermission = () => {
    if (selectedRole && newPermission.trim() !== '') {
      const updatedRole = {
        ...selectedRole,
        permissions: [...selectedRole.permissions, newPermission.trim()],
      };
      setSelectedRole(updatedRole);
      setNewPermission('');
      updateRolePermission(updatedRole);
      newPermissionInputRef.current?.focus();
    }
  };

  const handleRemovePermission = (permission: string) => {
    if (selectedRole) {
      const updatedPermissions = selectedRole.permissions.filter((p) => p !== permission);
      const updatedRole = {
        ...selectedRole,
        permissions: updatedPermissions,
      };
      setSelectedRole(updatedRole);
      updateRolePermission(updatedRole);
    }
  };

  const updateRolePermission = useCallback(
    async (role: RolePermission) => {
      try {
        await axios.put(`/api/role-permissions/${role.id}`, role);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(`Error updating role permission: ${axiosError.message}`);
      }
    },
    [setError]
  );

  return (
    <div>
      <h1>Role Permissions</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      <div>
        <h2>Roles</h2>
        <ul>
          {rolePermissions.map((role) => (
            <li
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              style={{
                backgroundColor: selectedRole?.id === role.id ? 'lightgray' : 'transparent',
              }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedRole?.id === role.id}
            >
              {role.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedRole && (
        <div>
          <h2>{selectedRole.name}</h2>
          <p>{selectedRole.description}</p>
          <h3>Permissions</h3>
          <ul>
            {selectedRole.permissions.map((permission) => (
              <li key={permission}>
                {permission}{' '}
                <button
                  onClick={() => handleRemovePermission(permission)}
                  aria-label={`Remove ${permission} permission`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            placeholder="Add new permission"
            aria-label="Add new permission"
            ref={newPermissionInputRef}
          />
          <button onClick={handleAddPermission} aria-label="Add permission">
            Add Permission
          </button>
        </div>
      )}
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
  const [newPermission, setNewPermission] = useState('');
  const [error, setError] = useState<string | null>(null);
  const newPermissionInputRef = useRef<HTMLInputElement>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Error fetching role permissions: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  const handleRoleSelect = (role: RolePermission) => {
    setSelectedRole(role);
  };

  const handleAddPermission = () => {
    if (selectedRole && newPermission.trim() !== '') {
      const updatedRole = {
        ...selectedRole,
        permissions: [...selectedRole.permissions, newPermission.trim()],
      };
      setSelectedRole(updatedRole);
      setNewPermission('');
      updateRolePermission(updatedRole);
      newPermissionInputRef.current?.focus();
    }
  };

  const handleRemovePermission = (permission: string) => {
    if (selectedRole) {
      const updatedPermissions = selectedRole.permissions.filter((p) => p !== permission);
      const updatedRole = {
        ...selectedRole,
        permissions: updatedPermissions,
      };
      setSelectedRole(updatedRole);
      updateRolePermission(updatedRole);
    }
  };

  const updateRolePermission = useCallback(
    async (role: RolePermission) => {
      try {
        await axios.put(`/api/role-permissions/${role.id}`, role);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(`Error updating role permission: ${axiosError.message}`);
      }
    },
    [setError]
  );

  return (
    <div>
      <h1>Role Permissions</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      <div>
        <h2>Roles</h2>
        <ul>
          {rolePermissions.map((role) => (
            <li
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              style={{
                backgroundColor: selectedRole?.id === role.id ? 'lightgray' : 'transparent',
              }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedRole?.id === role.id}
            >
              {role.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedRole && (
        <div>
          <h2>{selectedRole.name}</h2>
          <p>{selectedRole.description}</p>
          <h3>Permissions</h3>
          <ul>
            {selectedRole.permissions.map((permission) => (
              <li key={permission}>
                {permission}{' '}
                <button
                  onClick={() => handleRemovePermission(permission)}
                  aria-label={`Remove ${permission} permission`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            placeholder="Add new permission"
            aria-label="Add new permission"
            ref={newPermissionInputRef}
          />
          <button onClick={handleAddPermission} aria-label="Add permission">
            Add Permission
          </button>
        </div>
      )}
    </div>
  );
};

export default RolePermissions;