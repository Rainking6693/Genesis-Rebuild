import { Permissions, Role } from './PermissionTypes'; // Assuming you have a separate file for permission types

/**
 * Function to manage role-based permissions for EcoConvert AI users.
 *
 * @param {Role[]} userRoles - An array of user roles. Each role is represented by a Role enum value.
 * @returns {Permissions} - An object containing the permissions associated with the user's roles.
 */
export function getUserPermissions(userRoles: Role[]): Permissions {
  const permissions = {
    // Define permissions for each role here.
    // For example:
    ADMIN: {
      canCreateContent: true,
      canEditContent: true,
      canDeleteContent: true,
      canManageUsers: true,
      canViewAnalytics: true,
    },
    USER: {
      canCreateContent: false,
      canEditContent: false,
      canDeleteContent: false,
      canManageUsers: false,
      canViewAnalytics: true,
    },
    // Add more roles and their corresponding permissions as needed.
  };

  const userPermissionObject: Partial<Permissions> = {}; // Using Partial to allow for missing roles

  userRoles.forEach((role) => {
    if (permissions[role]) {
      Object.assign(userPermissionObject, permissions[role]);
    }
  });

  // Ensure the returned object is a valid Permissions object
  const validPermissions: Permissions = { ...permissions };
  Object.keys(userPermissionObject).forEach((key) => {
    if (validPermissions[key]) {
      validPermissions[key] = userPermissionObject[key];
    }
  });

  // Check if all required permissions are present in the returned object
  const requiredPermissions = ['canCreateContent', 'canEditContent', 'canDeleteContent', 'canManageUsers', 'canViewAnalytics'];
  requiredPermissions.forEach((permission) => {
    if (!validPermissions[permission]) {
      throw new Error(`Missing permission: ${permission}`);
    }
  });

  return validPermissions;
}

import { Permissions, Role } from './PermissionTypes'; // Assuming you have a separate file for permission types

/**
 * Function to manage role-based permissions for EcoConvert AI users.
 *
 * @param {Role[]} userRoles - An array of user roles. Each role is represented by a Role enum value.
 * @returns {Permissions} - An object containing the permissions associated with the user's roles.
 */
export function getUserPermissions(userRoles: Role[]): Permissions {
  const permissions = {
    // Define permissions for each role here.
    // For example:
    ADMIN: {
      canCreateContent: true,
      canEditContent: true,
      canDeleteContent: true,
      canManageUsers: true,
      canViewAnalytics: true,
    },
    USER: {
      canCreateContent: false,
      canEditContent: false,
      canDeleteContent: false,
      canManageUsers: false,
      canViewAnalytics: true,
    },
    // Add more roles and their corresponding permissions as needed.
  };

  const userPermissionObject: Partial<Permissions> = {}; // Using Partial to allow for missing roles

  userRoles.forEach((role) => {
    if (permissions[role]) {
      Object.assign(userPermissionObject, permissions[role]);
    }
  });

  // Ensure the returned object is a valid Permissions object
  const validPermissions: Permissions = { ...permissions };
  Object.keys(userPermissionObject).forEach((key) => {
    if (validPermissions[key]) {
      validPermissions[key] = userPermissionObject[key];
    }
  });

  // Check if all required permissions are present in the returned object
  const requiredPermissions = ['canCreateContent', 'canEditContent', 'canDeleteContent', 'canManageUsers', 'canViewAnalytics'];
  requiredPermissions.forEach((permission) => {
    if (!validPermissions[permission]) {
      throw new Error(`Missing permission: ${permission}`);
    }
  });

  return validPermissions;
}