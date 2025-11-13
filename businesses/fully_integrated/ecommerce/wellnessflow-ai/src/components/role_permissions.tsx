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
      <h2>Role Permissions</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <table aria-label="Role Permissions" className="table">
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
                  <ul>
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
      <h2>Role Permissions</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <table aria-label="Role Permissions" className="table">
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
                  <ul>
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