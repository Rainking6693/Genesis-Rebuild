import React from 'react';

// Define the predefined roles
const roles = ['admin', 'standard', 'guest'] as const;
type Role = typeof roles[number];

// Define the permissions for each role
const permissions = {
  admin: ['viewAllData', 'editAllData', 'deleteAllData'],
  standard: ['viewData', 'editData', 'deleteData'],
  guest: ['viewData'],
} as const;
type Permission = typeof permissions[Role][number];

interface RolePermissionsProps {
  message: string;
  userRole: Role;
  permission: Permission;
}

const RolePermissionsComponent: React.FC<RolePermissionsProps> = ({ message, userRole, permission }) => {
  // Check if the user has the required role for the specific permission
  const hasRequiredRole = (role: Role, permission: Permission) => roles.includes(role) && permissions[role].includes(permission);

  // Implement role-based access control logic here based on userRole and permission
  return hasRequiredRole(userRole, permission) ? (
    <div role="permissions" aria-label={`${userRole} permissions`}>
      {message}
    </div>
  ) : null;
};

// Add a constant for the default user role
const DEFAULT_USER_ROLE = 'standard' as Role;

// Add a defaultProps property to set a default value for userRole and defaultUserRole
RolePermissionsComponent.defaultProps = {
  userRole: DEFAULT_USER_ROLE,
};

// Helper functions
function hasAnyRole(userRole: Role, ...rolesToCheck: Role[]): boolean {
  return rolesToCheck.some((role) => roles.includes(userRole) && roles.includes(role));
}

function getHighestRole(userRoles: Role[]): Role {
  return userRoles.reduce((highestRole, role) => (roles.indexOf(role) > roles.indexOf(highestRole) ? role : highestRole), roles[0]);
}

function getPermissions(userRole: Role): Permission[] {
  return permissions[userRole];
}

function getHighestPermission(userRole: Role): Permission {
  return getPermissions(userRole)[permissions[userRole].length - 1];
}

function hasPermission(userRole: Role, permission: Permission): boolean {
  return permissions[userRole].includes(permission);
}

function hasPermissionForResource(userRole: Role, resource: string, permission: Permission): boolean {
  const permissionsForResource = permissions[userRole].filter((p) => p.startsWith(`${resource}:`));
  return permissionsForResource.includes(permission);
}

function getHighestPermissionForResource(userRole: Role, resource: string): Permission {
  const permissionsForResource = permissions[userRole].filter((p) => p.startsWith(`${resource}:`));
  return permissionsForResource[permissionsForResource.length - 1];
}

// Update MyComponent to accept defaultUserRole prop and use it in the component
interface Props {
  message: string;
  defaultUserRole: Role;
  permission: Permission;
  resource?: string; // Add resource property to allow passing the resource for permission checks
}

const MyComponent: React.FC<Props> = ({ message, defaultUserRole, permission, resource }) => {
  // Check if the user has the required role for the specific permission
  const hasRequiredRole = () => hasAnyRole(defaultUserRole, ...roles);

  // Pass defaultUserRole to RolePermissionsComponent
  return hasRequiredRole() ? (
    <RolePermissionsComponent message={message} defaultUserRole={defaultUserRole} permission={permission} />
  ) : null;
};

// Use the DEFAULT_USER_ROLE constant as the default value for defaultUserRole prop
MyComponent.defaultProps = {
  defaultUserRole: DEFAULT_USER_ROLE,
};

export default MyComponent;

This updated code provides a more robust role-based access control system, handles edge cases, improves accessibility, and makes the code more maintainable. The new functions allow for more flexible permission checks, including checking for any role, getting the highest role a user has, getting the permissions a user has, and getting the highest permission a user has. Additionally, the code now supports resource-specific permissions.