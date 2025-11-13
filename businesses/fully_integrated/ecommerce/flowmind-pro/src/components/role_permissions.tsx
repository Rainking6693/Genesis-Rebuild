import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchRolePermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<RolePermission[]>>('/api/role-permissions', {
        // Add a timeout to prevent indefinite loading
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        if (Array.isArray(response.data)) {
          setRolePermissions(response.data);
        } else if (response.data && typeof response.data === 'object' && Array.isArray((response.data as any).data)) {
          // Handle cases where the API returns data nested under a "data" property
          setRolePermissions((response.data as any).data);
        } else {
          setError('Invalid data format received from the API.');
          console.error('Invalid data format:', response.data); // Log for debugging
        }
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } else {
        setError(`Failed to fetch data. Status code: ${response.status}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = 'An unexpected error occurred.';

      if (axiosError.response) {
        errorMessage =
          axiosError.response.data?.message ||
          `Failed to fetch data. Status: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errorMessage = 'No response received from the server.';
      } else {
        errorMessage = axiosError.message || 'An error occurred while fetching role permissions.';
      }

      setError(errorMessage);
      console.error('Error fetching role permissions:', axiosError);

      // Implement retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryCount + 1} seconds...`);
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, (retryCount + 1) * 1000); // Exponential backoff
      } else {
        setError(`Failed to fetch data after ${maxRetries} retries. ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, maxRetries]);

  useEffect(() => {
    if (retryCount <= maxRetries) {
      fetchRolePermissions();
    }
  }, [fetchRolePermissions, retryCount, maxRetries]);

  const retryFetch = useCallback(() => {
    setRetryCount(0); // Reset retry count
    fetchRolePermissions(); // Trigger the fetch again
  }, [fetchRolePermissions]);

  return (
    <div className="role-permissions-container">
      <h2 id="role-permissions-title">Role Permissions</h2>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
          <button onClick={retryFetch} className="retry-button">
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        rolePermissions.length > 0 ? (
          <table aria-labelledby="role-permissions-title">
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
                        <li key={index}>{perm}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">No role permissions found.</div>
        )
      )}
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchRolePermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse<RolePermission[]>>('/api/role-permissions', {
        // Add a timeout to prevent indefinite loading
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        if (Array.isArray(response.data)) {
          setRolePermissions(response.data);
        } else if (response.data && typeof response.data === 'object' && Array.isArray((response.data as any).data)) {
          // Handle cases where the API returns data nested under a "data" property
          setRolePermissions((response.data as any).data);
        } else {
          setError('Invalid data format received from the API.');
          console.error('Invalid data format:', response.data); // Log for debugging
        }
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } else {
        setError(`Failed to fetch data. Status code: ${response.status}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = 'An unexpected error occurred.';

      if (axiosError.response) {
        errorMessage =
          axiosError.response.data?.message ||
          `Failed to fetch data. Status: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errorMessage = 'No response received from the server.';
      } else {
        errorMessage = axiosError.message || 'An error occurred while fetching role permissions.';
      }

      setError(errorMessage);
      console.error('Error fetching role permissions:', axiosError);

      // Implement retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryCount + 1} seconds...`);
        setTimeout(() => {
          setRetryCount((prevCount) => prevCount + 1);
        }, (retryCount + 1) * 1000); // Exponential backoff
      } else {
        setError(`Failed to fetch data after ${maxRetries} retries. ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount, maxRetries]);

  useEffect(() => {
    if (retryCount <= maxRetries) {
      fetchRolePermissions();
    }
  }, [fetchRolePermissions, retryCount, maxRetries]);

  const retryFetch = useCallback(() => {
    setRetryCount(0); // Reset retry count
    fetchRolePermissions(); // Trigger the fetch again
  }, [fetchRolePermissions]);

  return (
    <div className="role-permissions-container">
      <h2 id="role-permissions-title">Role Permissions</h2>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
          <button onClick={retryFetch} className="retry-button">
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        rolePermissions.length > 0 ? (
          <table aria-labelledby="role-permissions-title">
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
                        <li key={index}>{perm}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">No role permissions found.</div>
        )
      )}
    </div>
  );
};

export default RolePermissions;