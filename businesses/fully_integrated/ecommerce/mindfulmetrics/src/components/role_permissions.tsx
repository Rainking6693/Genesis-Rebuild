import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionsProps {
  apiEndpoint?: string; // Allows customization of the API endpoint
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ apiEndpoint = '/api/role-permissions' }) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      const response = await axios.get<RolePermission[]>(apiEndpoint);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from the API.'); // Handle unexpected data
      }

      setRolePermissions(response.data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = 'An unexpected error occurred.';

      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || `Error: ${axiosError.response.status} - ${axiosError.response.statusText}`;
      } else if (axiosError.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = axiosError.message; // Capture other errors
      }

      setError(errorMessage);

      if (retryCount < maxRetries) {
        console.log(`Attempting retry: ${retryCount + 1}`);
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
        }, 2000); // Retry after 2 seconds
      } else {
        console.error('Failed to fetch role permissions after multiple retries.', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, retryCount]);

  useEffect(() => {
    if (retryCount === 0) {
      fetchRolePermissions();
    } else if (retryCount <= maxRetries) {
      fetchRolePermissions();
    }
  }, [fetchRolePermissions, retryCount, maxRetries]);

  const handleRetry = () => {
    setRetryCount(0); // Reset retry count to trigger fetchRolePermissions again
  };

  return (
    <div className="role-permissions-container">
      <h1>Role Permissions</h1>
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
          {retryCount < maxRetries && (
            <button onClick={handleRetry} aria-label="Retry fetching role permissions">
              Retry
            </button>
          )}
        </div>
      ) : rolePermissions.length === 0 ? (
        <div className="no-data-message">No role permissions found.</div>
      ) : (
        <div className="table-wrapper">
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
                  <td>{rolePermission.name || 'N/A'}</td>
                  <td>{rolePermission.description || 'N/A'}</td>
                  <td>
                    <ul className="permissions-list">
                      {rolePermission.permissions.length > 0 ? (
                        rolePermission.permissions.map((permission, index) => (
                          <li key={index} className="permission-item">{permission || 'N/A'}</li>
                        ))
                      ) : (
                        <li>No permissions assigned.</li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        .role-permissions-container {
          font-family: sans-serif;
          padding: 20px;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .loading-indicator {
          text-align: center;
          font-style: italic;
          color: gray;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid red;
          background-color: #ffe6e6;
        }

        .no-data-message {
          text-align: center;
          color: gray;
        }

        .table-wrapper {
          overflow-x: auto; /* Enable horizontal scrolling for smaller screens */
        }

        .role-permissions-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .role-permissions-table th,
        .role-permissions-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .role-permissions-table th {
          background-color: #f2f2f2;
        }

        .permissions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .permission-item {
          padding: 5px 0;
        }

        button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          margin-left: 10px;
        }

        button:hover {
          background-color: #3e8e41;
        }
      `}</style>
    </div>
  );
};

export default RolePermissions;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionsProps {
  apiEndpoint?: string; // Allows customization of the API endpoint
}

const RolePermissions: React.FC<RolePermissionsProps> = ({ apiEndpoint = '/api/role-permissions' }) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchRolePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      const response = await axios.get<RolePermission[]>(apiEndpoint);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from the API.'); // Handle unexpected data
      }

      setRolePermissions(response.data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage = 'An unexpected error occurred.';

      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || `Error: ${axiosError.response.status} - ${axiosError.response.statusText}`;
      } else if (axiosError.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = axiosError.message; // Capture other errors
      }

      setError(errorMessage);

      if (retryCount < maxRetries) {
        console.log(`Attempting retry: ${retryCount + 1}`);
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
        }, 2000); // Retry after 2 seconds
      } else {
        console.error('Failed to fetch role permissions after multiple retries.', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, retryCount]);

  useEffect(() => {
    if (retryCount === 0) {
      fetchRolePermissions();
    } else if (retryCount <= maxRetries) {
      fetchRolePermissions();
    }
  }, [fetchRolePermissions, retryCount, maxRetries]);

  const handleRetry = () => {
    setRetryCount(0); // Reset retry count to trigger fetchRolePermissions again
  };

  return (
    <div className="role-permissions-container">
      <h1>Role Permissions</h1>
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
          {retryCount < maxRetries && (
            <button onClick={handleRetry} aria-label="Retry fetching role permissions">
              Retry
            </button>
          )}
        </div>
      ) : rolePermissions.length === 0 ? (
        <div className="no-data-message">No role permissions found.</div>
      ) : (
        <div className="table-wrapper">
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
                  <td>{rolePermission.name || 'N/A'}</td>
                  <td>{rolePermission.description || 'N/A'}</td>
                  <td>
                    <ul className="permissions-list">
                      {rolePermission.permissions.length > 0 ? (
                        rolePermission.permissions.map((permission, index) => (
                          <li key={index} className="permission-item">{permission || 'N/A'}</li>
                        ))
                      ) : (
                        <li>No permissions assigned.</li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        .role-permissions-container {
          font-family: sans-serif;
          padding: 20px;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .loading-indicator {
          text-align: center;
          font-style: italic;
          color: gray;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid red;
          background-color: #ffe6e6;
        }

        .no-data-message {
          text-align: center;
          color: gray;
        }

        .table-wrapper {
          overflow-x: auto; /* Enable horizontal scrolling for smaller screens */
        }

        .role-permissions-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .role-permissions-table th,
        .role-permissions-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .role-permissions-table th {
          background-color: #f2f2f2;
        }

        .permissions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .permission-item {
          padding: 5px 0;
        }

        button {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          margin-left: 10px;
        }

        button:hover {
          background-color: #3e8e41;
        }
      `}</style>
    </div>
  );
};

export default RolePermissions;