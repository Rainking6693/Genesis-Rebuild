import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  return (
    <div>
      <h1>Role Permissions</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading role permissions...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : rolePermissions.length === 0 ? (
        <div>No role permissions found.</div>
      ) : (
        <table aria-label="Role Permissions">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.role}</td>
                <td>
                  <ul>
                    {permission.permissions.map((perm, index) => (
                      <li key={index}>{perm}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();
  }, [fetchRolePermissions]);

  return (
    <div>
      <h1>Role Permissions</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading role permissions...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : rolePermissions.length === 0 ? (
        <div>No role permissions found.</div>
      ) : (
        <table aria-label="Role Permissions">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.role}</td>
                <td>
                  <ul>
                    {permission.permissions.map((perm, index) => (
                      <li key={index}>{perm}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolePermissions;