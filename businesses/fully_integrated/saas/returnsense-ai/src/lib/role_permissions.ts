import { Role } from './role.enum';

type User = {
  id: string;
  role: Role;
  permissions: string[];
};

type RolePermissionsRepository = {
  saveUserRoleAndPermissions: (user: User) => Promise<void>;
  getUserById: (userId: string) => Promise<User | null>;
};

type UpdateUserRoleAndPermissionsFunction = (
  userId: string,
  role: Role,
  permissions: string[]
) => Promise<void>;

class ManageRolePermissions {
  private readonly rolePermissionsRepository: RolePermissionsRepository;
  private readonly updateUserRoleAndPermissions: UpdateUserRoleAndPermissionsFunction;

  constructor(
    rolePermissionsRepository: RolePermissionsRepository,
    updateUserRoleAndPermissions: UpdateUserRoleAndPermissionsFunction
  ) {
    this.rolePermissionsRepository = rolePermissionsRepository;
    this.updateUserRoleAndPermissions = updateUserRoleAndPermissions;
  }

  public async manageRolePermissions(
    userId: string,
    role: Role,
    permissions: string[]
  ): Promise<void> {
    const user = await this.rolePermissionsRepository.getUserById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!isValidRole(role)) {
      throw new Error('Invalid role provided.');
    }

    if (!isValidPermissions(permissions)) {
      throw new Error('Invalid permissions provided.');
    }

    if (user.role === role && isEqualPermissions(user.permissions, permissions)) {
      return;
    }

    const updatedUser = { ...user, role, permissions };
    const savedUser = await this.rolePermissionsRepository.saveUserRoleAndPermissions(updatedUser);

    if (!savedUser) {
      throw new Error('Error saving user role and permissions.');
    }

    await this.updateUserRoleAndPermissions(userId, role, permissions);
  }
}

function isValidRole(role: Role): role is Role {
  return Object.values(Role).includes(role);
}

function isEqualPermissions(permissions1: string[], permissions2: string[]): boolean {
  return permissions1.length === permissions2.length && permissions1.every((permission, index) => permission === permissions2[index]);
}

function isValidPermissions(permissions: string[]): permissions is string[] {
  return permissions.every((permission) => Object.values(Role).some((role) => rolePermissions[role].includes(permission)));
}

const rolePermissions = {
  [Role.USER]: ['permission1', 'permission2', 'permission3'],
  [Role.ADMIN]: ['permission1', 'permission2', 'permission3', 'permission4'],
};

// Example implementation of RolePermissionsRepository
// This is just an example, you should use a proper database or storage solution
class InMemoryRolePermissionsRepository implements RolePermissionsRepository {
  private users: User[] = [];

  public async saveUserRoleAndPermissions(user: User): Promise<void> {
    this.users.push(user);
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.users.find((user) => user.id === userId);
  }
}

// Example implementation of UpdateUserRoleAndPermissionsFunction
// This is just an example, you should use a proper database or storage solution
async function updateUserRoleAndPermissionsInSystem(
  userId: string,
  role: Role,
  permissions: string[]
): Promise<void> {
  // Perform a secure update operation on the user's role and permissions
  // (e.g., using prepared statements or parameterized queries to prevent SQL injection)
}

// Usage
const rolePermissionsRepository = new InMemoryRolePermissionsRepository();
const updateUserRoleAndPermissions = updateUserRoleAndPermissionsInSystem;
const manageRolePermissions = new ManageRolePermissions(
  rolePermissionsRepository,
  updateUserRoleAndPermissions
);

manageRolePermissions.manageRolePermissions('user-id', Role.ADMIN, ['permission1', 'permission2']);

import { Role } from './role.enum';

type User = {
  id: string;
  role: Role;
  permissions: string[];
};

type RolePermissionsRepository = {
  saveUserRoleAndPermissions: (user: User) => Promise<void>;
  getUserById: (userId: string) => Promise<User | null>;
};

type UpdateUserRoleAndPermissionsFunction = (
  userId: string,
  role: Role,
  permissions: string[]
) => Promise<void>;

class ManageRolePermissions {
  private readonly rolePermissionsRepository: RolePermissionsRepository;
  private readonly updateUserRoleAndPermissions: UpdateUserRoleAndPermissionsFunction;

  constructor(
    rolePermissionsRepository: RolePermissionsRepository,
    updateUserRoleAndPermissions: UpdateUserRoleAndPermissionsFunction
  ) {
    this.rolePermissionsRepository = rolePermissionsRepository;
    this.updateUserRoleAndPermissions = updateUserRoleAndPermissions;
  }

  public async manageRolePermissions(
    userId: string,
    role: Role,
    permissions: string[]
  ): Promise<void> {
    const user = await this.rolePermissionsRepository.getUserById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!isValidRole(role)) {
      throw new Error('Invalid role provided.');
    }

    if (!isValidPermissions(permissions)) {
      throw new Error('Invalid permissions provided.');
    }

    if (user.role === role && isEqualPermissions(user.permissions, permissions)) {
      return;
    }

    const updatedUser = { ...user, role, permissions };
    const savedUser = await this.rolePermissionsRepository.saveUserRoleAndPermissions(updatedUser);

    if (!savedUser) {
      throw new Error('Error saving user role and permissions.');
    }

    await this.updateUserRoleAndPermissions(userId, role, permissions);
  }
}

function isValidRole(role: Role): role is Role {
  return Object.values(Role).includes(role);
}

function isEqualPermissions(permissions1: string[], permissions2: string[]): boolean {
  return permissions1.length === permissions2.length && permissions1.every((permission, index) => permission === permissions2[index]);
}

function isValidPermissions(permissions: string[]): permissions is string[] {
  return permissions.every((permission) => Object.values(Role).some((role) => rolePermissions[role].includes(permission)));
}

const rolePermissions = {
  [Role.USER]: ['permission1', 'permission2', 'permission3'],
  [Role.ADMIN]: ['permission1', 'permission2', 'permission3', 'permission4'],
};

// Example implementation of RolePermissionsRepository
// This is just an example, you should use a proper database or storage solution
class InMemoryRolePermissionsRepository implements RolePermissionsRepository {
  private users: User[] = [];

  public async saveUserRoleAndPermissions(user: User): Promise<void> {
    this.users.push(user);
  }

  public async getUserById(userId: string): Promise<User | null> {
    return this.users.find((user) => user.id === userId);
  }
}

// Example implementation of UpdateUserRoleAndPermissionsFunction
// This is just an example, you should use a proper database or storage solution
async function updateUserRoleAndPermissionsInSystem(
  userId: string,
  role: Role,
  permissions: string[]
): Promise<void> {
  // Perform a secure update operation on the user's role and permissions
  // (e.g., using prepared statements or parameterized queries to prevent SQL injection)
}

// Usage
const rolePermissionsRepository = new InMemoryRolePermissionsRepository();
const updateUserRoleAndPermissions = updateUserRoleAndPermissionsInSystem;
const manageRolePermissions = new ManageRolePermissions(
  rolePermissionsRepository,
  updateUserRoleAndPermissions
);

manageRolePermissions.manageRolePermissions('user-id', Role.ADMIN, ['permission1', 'permission2']);