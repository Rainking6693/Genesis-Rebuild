import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  role?: string; // Add optional role parameter for dynamic permissions
}

interface RolePermission {
  canManageSubscriptions: boolean;
  canEditProducts: boolean;
  canViewAnalytics: boolean;
}

const defaultRolePermission: RolePermission = {
  canManageSubscriptions: false,
  canEditProducts: false,
  canViewAnalytics: false,
};

const defaultUnauthenticatedPermission: RolePermission = {
  canManageSubscriptions: false,
  canEditProducts: false,
  canViewAnalytics: false,
};

const [cookies, setCookie, removeCookie] = useCookies(['userRole']);

const getRolePermission = (role: string): RolePermission => {
  // Implement logic to fetch role-based permissions from a secure API or database
  // For simplicity, let's assume we have predefined permissions for each role
  const predefinedPermissions: Record<string, RolePermission> = {
    admin: {
      canManageSubscriptions: true,
      canEditProducts: true,
      canViewAnalytics: true,
    },
    moderator: {
      canManageSubscriptions: true,
      canEditProducts: true,
      canViewAnalytics: false,
    },
    creator: {
      canManageSubscriptions: true,
      canEditProducts: true,
      canViewAnalytics: true,
    },
    // Add other roles if necessary
    unknown: defaultRolePermission, // Default permission for unknown roles
  };

  return predefinedPermissions[role] || defaultRolePermission;
};

const RolePermissions = ({ role }: Props) => {
  const [permissions, setPermissions] = useState<RolePermission>(defaultUnauthenticatedPermission);
  const [loading, setLoading] = useState<boolean>(true);

  const handleRoleChange = (newRole: string) => {
    setPermissions(getRolePermission(newRole));
    setLoading(false);
    setCookie('userRole', newRole, { path: '/', expires: new Date(Date.now() + 3600000) }); // Set cookie to expire in 1 hour
  };

  useEffect(() => {
    if (role) {
      handleRoleChange(role);
    }
  }, [role]);

  useEffect(() => {
    if (role) {
      setLoading(true);
      handleRoleChange(role);
    }
  }, []);

  const permissionsList = Object.entries(permissions).map(([key, value]) => {
    return (
      <div key={key} aria-hidden={!value}>
        {value && <div>{key}</div>}
      </div>
    );
  });

  return (
    <div>
      {loading ? (
        <div>Loading permissions...</div>
      ) : (
        <div>{permissionsList}</div>
      )}
    </div>
  );
};

export default RolePermissions;

This updated version of the RolePermissions component addresses the issues you mentioned and provides a more robust and maintainable solution.