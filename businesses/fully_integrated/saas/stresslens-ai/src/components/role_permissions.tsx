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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response = await axios.get<RolePermission[]>('/api/role-permissions', {
        signal: abortControllerRef.current.signal,
      });
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const error = err as AxiosError;
        setError(`Error fetching role permissions: ${error.message}`);
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
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table aria-label="Role Permissions" className="role-permissions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((rolePermission) => (
              <tr key={rolePermission.id}>
                <td>{rolePermission.name}</td>
                <td>{rolePermission.description}</td>
                <td>
                  <ul className="permissions-list">
                    {rolePermission.permissions.map((permission, index) => (
                      <li key={index}>{permission}</li>
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
  name: string;
  description: string;
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
      const response = await axios.get<RolePermission[]>('/api/role-permissions', {
        signal: abortControllerRef.current.signal,
      });
      setRolePermissions(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const error = err as AxiosError;
        setError(`Error fetching role permissions: ${error.message}`);
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
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table aria-label="Role Permissions" className="role-permissions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((rolePermission) => (
              <tr key={rolePermission.id}>
                <td>{rolePermission.name}</td>
                <td>{rolePermission.description}</td>
                <td>
                  <ul className="permissions-list">
                    {rolePermission.permissions.map((permission, index) => (
                      <li key={index}>{permission}</li>
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