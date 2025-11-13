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
      const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>('/api/role-permissions');
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching role permissions.'
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
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Role Permissions" className="role-permissions-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.length > 0 ? (
              rolePermissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.role}</td>
                  <td>
                    <ul className="permissions-list">
                      {permission.permissions.map((perm, index) => (
                        <li key={index}>{perm}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No role permissions found.</td>
              </tr>
            )}
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
      const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>('/api/role-permissions');
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching role permissions.'
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
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Role Permissions" className="role-permissions-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.length > 0 ? (
              rolePermissions.map((permission) => (
                <tr key={permission.id}>
                  <td>{permission.role}</td>
                  <td>
                    <ul className="permissions-list">
                      {permission.permissions.map((perm, index) => (
                        <li key={index}>{perm}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No role permissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolePermissions;