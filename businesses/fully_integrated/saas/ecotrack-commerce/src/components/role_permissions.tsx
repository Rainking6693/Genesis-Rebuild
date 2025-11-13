import React, { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>(
          '/api/role-permissions'
        );
        setRolePermissions(response.data);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolePermissions();
  }, []);

  return (
    <div>
      <h1>Role Permissions</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : rolePermissions.length > 0 ? (
        <table aria-label="Role Permissions">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((rolePermission) => (
              <tr key={rolePermission.id}>
                <td>{rolePermission.role}</td>
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
      ) : (
        <p>No role permissions found.</p>
      )}
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<RolePermission[]> = await axios.get<RolePermission[]>(
          '/api/role-permissions'
        );
        setRolePermissions(response.data);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching role permissions.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolePermissions();
  }, []);

  return (
    <div>
      <h1>Role Permissions</h1>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : rolePermissions.length > 0 ? (
        <table aria-label="Role Permissions">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((rolePermission) => (
              <tr key={rolePermission.id}>
                <td>{rolePermission.role}</td>
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
      ) : (
        <p>No role permissions found.</p>
      )}
    </div>
  );
};

export default RolePermissions;