import { Role } from './user_roles';

// Define the Permission type
type Permission =
  | 'view_all_data'
  | 'edit_all_data'
  | 'view_team_data'
  | 'edit_team_data'
  | 'view_own_data'
  | 'manage_users'
  | 'purchase_carbon_credits';

// Define the UserRolePermissions type
type UserRolePermissions = Permission[];

// Define the function signature with clear input and output types
function assignRolePermissions(role: Role, permissions: UserRolePermissions = []): void {
  validateUserRolePermissions(role, permissions);

  // Assign role-specific permissions
  const rolePermissions = getRolePermissions(role);

  // Merge role-specific permissions with the provided permissions
  permissions = mergePermissions(rolePermissions, permissions);
}

// Validate the user role and permissions together
function validateUserRolePermissions(role: Role, permissions: UserRolePermissions): void {
  validateRole(role);
  validatePermissions(permissions);
}

// Validate the role
function validateRole(role: Role): void {
  if (!Object.values(Role).includes(role)) {
    throw new Error('Invalid role provided');
  }
}

// Validate the permissions
function validatePermissions(permissions: UserRolePermissions): void {
  if (!Array.isArray(permissions)) {
    throw new Error('Invalid permissions provided');
  }

  if (permissions.length === 0) {
    throw new Error('No permissions provided');
  }
}

// Get the role-specific permissions
function getRolePermissions(role: Role): UserRolePermissions {
  switch (role) {
    case Role.Admin:
      return ['view_all_data', 'edit_all_data', 'manage_users', 'purchase_carbon_credits'];
    case Role.TeamLead:
      return ['view_team_data', 'edit_team_data', 'manage_team_users'];
    case Role.Member:
      return ['view_own_data'];
    default:
      throw new Error('Invalid role provided');
  }
}

// Merge the role-specific permissions with the provided permissions
function mergePermissions(rolePermissions: UserRolePermissions, providedPermissions: UserRolePermissions): UserRolePermissions {
  return [...new Set([...rolePermissions, ...providedPermissions])];
}

// Check for invalid permissions
function checkForInvalidPermissions(permissions: UserRolePermissions): void {
  const uniquePermissions = uniquePermissions(permissions);

  if (!uniquePermissions.every((permission) => isValidPermission(permission))) {
    throw new Error('Invalid permissions provided');
  }
}

// Ensure permissions are unique
function uniquePermissions(permissions: UserRolePermissions): Permission[] {
  const uniquePermissions = new Set(permissions);
  return Array.from(uniquePermissions);
}

// Ensure a permission is valid
function isValidPermission(permission: Permission): boolean {
  return (
    permission === 'view_all_data' ||
    permission === 'edit_all_data' ||
    permission === 'view_team_data' ||
    permission === 'edit_team_data' ||
    permission === 'view_own_data' ||
    permission === 'manage_users' ||
    permission === 'purchase_carbon_credits'
  );
}

// Convert a permission to lowercase
function toLower(permission: Permission): Permission {
  return permission.toLowerCase();
}

import { Role } from './user_roles';

// Define the Permission type
type Permission =
  | 'view_all_data'
  | 'edit_all_data'
  | 'view_team_data'
  | 'edit_team_data'
  | 'view_own_data'
  | 'manage_users'
  | 'purchase_carbon_credits';

// Define the UserRolePermissions type
type UserRolePermissions = Permission[];

// Define the function signature with clear input and output types
function assignRolePermissions(role: Role, permissions: UserRolePermissions = []): void {
  validateUserRolePermissions(role, permissions);

  // Assign role-specific permissions
  const rolePermissions = getRolePermissions(role);

  // Merge role-specific permissions with the provided permissions
  permissions = mergePermissions(rolePermissions, permissions);
}

// Validate the user role and permissions together
function validateUserRolePermissions(role: Role, permissions: UserRolePermissions): void {
  validateRole(role);
  validatePermissions(permissions);
}

// Validate the role
function validateRole(role: Role): void {
  if (!Object.values(Role).includes(role)) {
    throw new Error('Invalid role provided');
  }
}

// Validate the permissions
function validatePermissions(permissions: UserRolePermissions): void {
  if (!Array.isArray(permissions)) {
    throw new Error('Invalid permissions provided');
  }

  if (permissions.length === 0) {
    throw new Error('No permissions provided');
  }
}

// Get the role-specific permissions
function getRolePermissions(role: Role): UserRolePermissions {
  switch (role) {
    case Role.Admin:
      return ['view_all_data', 'edit_all_data', 'manage_users', 'purchase_carbon_credits'];
    case Role.TeamLead:
      return ['view_team_data', 'edit_team_data', 'manage_team_users'];
    case Role.Member:
      return ['view_own_data'];
    default:
      throw new Error('Invalid role provided');
  }
}

// Merge the role-specific permissions with the provided permissions
function mergePermissions(rolePermissions: UserRolePermissions, providedPermissions: UserRolePermissions): UserRolePermissions {
  return [...new Set([...rolePermissions, ...providedPermissions])];
}

// Check for invalid permissions
function checkForInvalidPermissions(permissions: UserRolePermissions): void {
  const uniquePermissions = uniquePermissions(permissions);

  if (!uniquePermissions.every((permission) => isValidPermission(permission))) {
    throw new Error('Invalid permissions provided');
  }
}

// Ensure permissions are unique
function uniquePermissions(permissions: UserRolePermissions): Permission[] {
  const uniquePermissions = new Set(permissions);
  return Array.from(uniquePermissions);
}

// Ensure a permission is valid
function isValidPermission(permission: Permission): boolean {
  return (
    permission === 'view_all_data' ||
    permission === 'edit_all_data' ||
    permission === 'view_team_data' ||
    permission === 'edit_team_data' ||
    permission === 'view_own_data' ||
    permission === 'manage_users' ||
    permission === 'purchase_carbon_credits'
  );
}

// Convert a permission to lowercase
function toLower(permission: Permission): Permission {
  return permission.toLowerCase();
}