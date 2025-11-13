import { isEmpty, omitBy, pickBy } from 'lodash';

export type Role = 'admin' | 'user';

export interface Permission {
  viewTransactions?: boolean;
  manageTransactions?: boolean;
  generateReports?: boolean;
  viewComplianceReports?: boolean;
  generateCertificates?: boolean;
}

// Define roles with default permissions
const defaultPermissions: Record<Role, Permission> = {
  admin: {
    viewTransactions: true,
    manageTransactions: true,
    generateReports: true,
    viewComplianceReports: true,
    generateCertificates: true,
  },
  user: {
    viewTransactions: false,
    manageTransactions: false,
    generateReports: false,
    viewComplianceReports: false,
    generateCertificates: false,
  },
};

// Function to update role permissions
export function updateRolePermissions(role: Role, permissions: Partial<Permission>): Permission {
  const updatedPermissions = { ...defaultPermissions[role], ...permissions };

  // Ensure all properties are optional and have default values
  const optionalPermissions: Permission = {
    viewTransactions: false,
    manageTransactions: false,
    generateReports: false,
    viewComplianceReports: false,
    generateCertificates: false,
  };

  // Merge updatedPermissions with optionalPermissions to ensure all properties have default values
  return pickBy({ ...optionalPermissions, ...updatedPermissions }, Boolean);
}

// Function to check if a user has a specific permission
export function hasPermission(role: Role, permission: keyof Permission): boolean {
  return defaultPermissions[role]?.[permission] ?? false;
}

// Function to check if a user has any permissions
export function hasAnyPermissions(role: Role, permissions: (keyof Permission)[]): boolean {
  return permissions.some((permission) => defaultPermissions[role]?.[permission] ?? false);
}

// Function to check if a user has all the required permissions
export function hasAllRequiredPermissions(role: Role, requiredPermissions: (keyof Permission)[]): boolean {
  return requiredPermissions.every((permission) => defaultPermissions[role]?.[permission] ?? false);
}

// Function to get the permissions for a role
export function getRolePermissions(role: Role): Permission {
  return defaultPermissions[role];
}

// Function to check if the provided permissions are valid
export function areValidPermissions(permissions: Partial<Permission>): boolean {
  return !isEmpty(permissions) && Object.values(permissions).every(Boolean);
}

// Function to check if a user has a specific permission or has any of the provided permissions
export function hasPermissionOrAny(role: Role, permission: keyof Permission, ...additionalPermissions: (keyof Permission)[]): boolean {
  return hasPermission(role, permission) || hasAnyPermissions(role, [...[permission].concat(additionalPermissions)]);
}

// Function to check if a user has all the required permissions or has any of the provided permissions
export function hasAllRequiredPermissionsOrAny(role: Role, requiredPermissions: (keyof Permission)[], ...additionalPermissions: (keyof Permission)[]): boolean {
  return hasAllRequiredPermissions(role, requiredPermissions) || hasAnyPermissions(role, [...requiredPermissions].concat(additionalPermissions));
}

import { isEmpty, omitBy, pickBy } from 'lodash';

export type Role = 'admin' | 'user';

export interface Permission {
  viewTransactions?: boolean;
  manageTransactions?: boolean;
  generateReports?: boolean;
  viewComplianceReports?: boolean;
  generateCertificates?: boolean;
}

// Define roles with default permissions
const defaultPermissions: Record<Role, Permission> = {
  admin: {
    viewTransactions: true,
    manageTransactions: true,
    generateReports: true,
    viewComplianceReports: true,
    generateCertificates: true,
  },
  user: {
    viewTransactions: false,
    manageTransactions: false,
    generateReports: false,
    viewComplianceReports: false,
    generateCertificates: false,
  },
};

// Function to update role permissions
export function updateRolePermissions(role: Role, permissions: Partial<Permission>): Permission {
  const updatedPermissions = { ...defaultPermissions[role], ...permissions };

  // Ensure all properties are optional and have default values
  const optionalPermissions: Permission = {
    viewTransactions: false,
    manageTransactions: false,
    generateReports: false,
    viewComplianceReports: false,
    generateCertificates: false,
  };

  // Merge updatedPermissions with optionalPermissions to ensure all properties have default values
  return pickBy({ ...optionalPermissions, ...updatedPermissions }, Boolean);
}

// Function to check if a user has a specific permission
export function hasPermission(role: Role, permission: keyof Permission): boolean {
  return defaultPermissions[role]?.[permission] ?? false;
}

// Function to check if a user has any permissions
export function hasAnyPermissions(role: Role, permissions: (keyof Permission)[]): boolean {
  return permissions.some((permission) => defaultPermissions[role]?.[permission] ?? false);
}

// Function to check if a user has all the required permissions
export function hasAllRequiredPermissions(role: Role, requiredPermissions: (keyof Permission)[]): boolean {
  return requiredPermissions.every((permission) => defaultPermissions[role]?.[permission] ?? false);
}

// Function to get the permissions for a role
export function getRolePermissions(role: Role): Permission {
  return defaultPermissions[role];
}

// Function to check if the provided permissions are valid
export function areValidPermissions(permissions: Partial<Permission>): boolean {
  return !isEmpty(permissions) && Object.values(permissions).every(Boolean);
}

// Function to check if a user has a specific permission or has any of the provided permissions
export function hasPermissionOrAny(role: Role, permission: keyof Permission, ...additionalPermissions: (keyof Permission)[]): boolean {
  return hasPermission(role, permission) || hasAnyPermissions(role, [...[permission].concat(additionalPermissions)]);
}

// Function to check if a user has all the required permissions or has any of the provided permissions
export function hasAllRequiredPermissionsOrAny(role: Role, requiredPermissions: (keyof Permission)[], ...additionalPermissions: (keyof Permission)[]): boolean {
  return hasAllRequiredPermissions(role, requiredPermissions) || hasAnyPermissions(role, [...requiredPermissions].concat(additionalPermissions));
}