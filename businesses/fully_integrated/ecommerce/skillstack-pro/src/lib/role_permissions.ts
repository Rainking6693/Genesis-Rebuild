import { v4 as uuidv4 } from 'uuid';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

class RolePermissionError extends Error {}
class RolePermissionNotFoundError extends RolePermissionError {}
class RolePermissionInvalidError extends RolePermissionError {}

class RolePermission {
  private id: string;
  private name: string;
  private permissions: string[];

  constructor(name: string, permissions: string[]) {
    super();
    if (!Array.isArray(permissions)) {
      this.constructorName = 'RolePermission';
      this.message = `Permissions must be an array.`;
      throw new RolePermissionInvalidError(this.message);
    }

    this.id = uuidv4();
    this.name = name;
    this.permissions = permissions;

    if (!this.validatePermissions(permissions)) {
      this.constructorName = 'RolePermission';
      this.message = `All permissions must be strings.`;
      throw new RolePermissionInvalidError(this.message);
    }
  }

  public addPermission(permission: string): void {
    if (!this.isValidPermission(permission)) {
      this.constructorName = 'RolePermission';
      this.message = `Invalid permission: ${permission}`;
      throw new RolePermissionInvalidError(this.message);
    }

    this.permissions.push(permission);
  }

  public removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);

    if (index === -1) {
      this.constructorName = 'RolePermission';
      this.message = `Permission ${permission} not found.`;
      throw new RolePermissionNotFoundError(this.message);
    }

    this.permissions.splice(index, 1);
  }

  public hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  public getPermissions(): string[] {
    return this.permissions;
  }

  public getRoleName(): string {
    return this.name;
  }

  public clone(): RolePermission {
    return new RolePermission(this.name, [...this.permissions]);
  }

  public toJSON(): Role {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  private isValidPermission(permission: any): permission is string {
    return typeof permission === 'string';
  }

  private validatePermissions(permissions: any[]): permissions is string[] {
    return permissions.every((permission) => typeof permission === 'string');
  }
}

// Usage example
const adminRole = new RolePermission('Admin', ['viewOrders', 'editOrders', 'manageUsers']);
adminRole.addPermission('deleteOrders');

if (adminRole.hasPermission('viewOrders')) {
  console.log('Admin can view orders.');
}

adminRole.removePermission('editOrders');

if (!adminRole.hasPermission('editOrders')) {
  console.log('Admin can no longer edit orders.');
}

import { v4 as uuidv4 } from 'uuid';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

class RolePermissionError extends Error {}
class RolePermissionNotFoundError extends RolePermissionError {}
class RolePermissionInvalidError extends RolePermissionError {}

class RolePermission {
  private id: string;
  private name: string;
  private permissions: string[];

  constructor(name: string, permissions: string[]) {
    super();
    if (!Array.isArray(permissions)) {
      this.constructorName = 'RolePermission';
      this.message = `Permissions must be an array.`;
      throw new RolePermissionInvalidError(this.message);
    }

    this.id = uuidv4();
    this.name = name;
    this.permissions = permissions;

    if (!this.validatePermissions(permissions)) {
      this.constructorName = 'RolePermission';
      this.message = `All permissions must be strings.`;
      throw new RolePermissionInvalidError(this.message);
    }
  }

  public addPermission(permission: string): void {
    if (!this.isValidPermission(permission)) {
      this.constructorName = 'RolePermission';
      this.message = `Invalid permission: ${permission}`;
      throw new RolePermissionInvalidError(this.message);
    }

    this.permissions.push(permission);
  }

  public removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);

    if (index === -1) {
      this.constructorName = 'RolePermission';
      this.message = `Permission ${permission} not found.`;
      throw new RolePermissionNotFoundError(this.message);
    }

    this.permissions.splice(index, 1);
  }

  public hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  public getPermissions(): string[] {
    return this.permissions;
  }

  public getRoleName(): string {
    return this.name;
  }

  public clone(): RolePermission {
    return new RolePermission(this.name, [...this.permissions]);
  }

  public toJSON(): Role {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  private isValidPermission(permission: any): permission is string {
    return typeof permission === 'string';
  }

  private validatePermissions(permissions: any[]): permissions is string[] {
    return permissions.every((permission) => typeof permission === 'string');
  }
}

// Usage example
const adminRole = new RolePermission('Admin', ['viewOrders', 'editOrders', 'manageUsers']);
adminRole.addPermission('deleteOrders');

if (adminRole.hasPermission('viewOrders')) {
  console.log('Admin can view orders.');
}

adminRole.removePermission('editOrders');

if (!adminRole.hasPermission('editOrders')) {
  console.log('Admin can no longer edit orders.');
}