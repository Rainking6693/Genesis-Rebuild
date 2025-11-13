import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RolePermission {
  id: string;
  role: string;
  permissions: string[];
}

interface ErrorState {
  hasError: boolean;
  errorMessage: string | null;
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false, errorMessage: null });
  const fetchRolePermissionsRef = useRef(fetchRolePermissions);

  const fetchRolePermissions = useCallback(async () => {
    setLoading(true);
    setErrorState({ hasError: false, errorMessage: null }); // Reset error state on each fetch attempt

    try {
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch role permissions.';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        errorMessage = axiosError.message;

        if (axiosError.response) {
          errorMessage += ` Status: ${axiosError.response.status}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error fetching role permissions:', error);
      setErrorState({ hasError: true, errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissionsRef.current = fetchRolePermissions;
  }, [fetchRolePermissions]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRolePermissionsRef.current();
    };
    fetchData();
  }, []);

  const retryFetch = () => {
    fetchRolePermissionsRef.current();
  };

  if (loading) {
    return <div>Loading role permissions...</div>;
  }

  if (errorState.hasError) {
    return (
      <div>
        <h2>Error</h2>
        <p>{errorState.errorMessage}</p>
        <button onClick={retryFetch}>Retry</button>
      </div>
    );
  }

  if (!rolePermissions || rolePermissions.length === 0) {
    return <div>No role permissions found.</div>;
  }

  return (
    <div aria-live="polite">
      <h1>Role Permissions</h1>
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
                <ul aria-label={`Permissions for role ${permission.role}`} className="permissions-list">
                  {permission.permissions.map((perm, index) => (
                    <li key={index}>{perm}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

interface ErrorState {
  hasError: boolean;
  errorMessage: string | null;
}

const RolePermissions: React.FC = () => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false, errorMessage: null });
  const fetchRolePermissionsRef = useRef(fetchRolePermissions);

  const fetchRolePermissions = useCallback(async () => {
    setLoading(true);
    setErrorState({ hasError: false, errorMessage: null }); // Reset error state on each fetch attempt

    try {
      const response: AxiosResponse<RolePermission[]> = await axios.get('/api/role-permissions');
      setRolePermissions(response.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch role permissions.';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        errorMessage = axiosError.message;

        if (axiosError.response) {
          errorMessage += ` Status: ${axiosError.response.status}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error fetching role permissions:', error);
      setErrorState({ hasError: true, errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolePermissionsRef.current = fetchRolePermissions;
  }, [fetchRolePermissions]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRolePermissionsRef.current();
    };
    fetchData();
  }, []);

  const retryFetch = () => {
    fetchRolePermissionsRef.current();
  };

  if (loading) {
    return <div>Loading role permissions...</div>;
  }

  if (errorState.hasError) {
    return (
      <div>
        <h2>Error</h2>
        <p>{errorState.errorMessage}</p>
        <button onClick={retryFetch}>Retry</button>
      </div>
    );
  }

  if (!rolePermissions || rolePermissions.length === 0) {
    return <div>No role permissions found.</div>;
  }

  return (
    <div aria-live="polite">
      <h1>Role Permissions</h1>
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
                <ul aria-label={`Permissions for role ${permission.role}`} className="permissions-list">
                  {permission.permissions.map((perm, index) => (
                    <li key={index}>{perm}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissions;