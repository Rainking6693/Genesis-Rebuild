import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>(
        '/api/role-permissions',
        { signal }
      );
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
            {rolePermissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.role}</td>
                <td>
                  <ul className="permissions-list">
                    {permission.permissions.map((perm, index) => (
                      <li key={index} className="permission-item">
                        {perm}
                      </li>
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>(
        '/api/role-permissions',
        { signal }
      );
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchRolePermissions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
            {rolePermissions.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.role}</td>
                <td>
                  <ul className="permissions-list">
                    {permission.permissions.map((perm, index) => (
                      <li key={index} className="permission-item">
                        {perm}
                      </li>
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