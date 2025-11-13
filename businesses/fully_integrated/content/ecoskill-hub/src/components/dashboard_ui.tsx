import { User, UserWithTotalCompletedModules } from './User';

function isValidModule(module: User['completedModules'][number]): module is number {
  return typeof module === 'number' && module > 0;
}

function isValidUser(user: User): user is NonNullable<User> {
  return Array.isArray(user.completedModules) && user.completedModules.every(isValidModule);
}

function calculateTotalCompletedModules(user: User): number | undefined {
  if (!isValidUser(user)) {
    return undefined;
  }

  return user.completedModules.reduce((sum, module) => (isValidModule(module) ? sum + module : sum), 0);
}

interface UserWithTotalCompletedModules {
  user: User;
  totalCompletedModules?: number | undefined;
}

function createUserWithTotalCompletedModules(user: User): UserWithTotalCompletedModules {
  const totalCompletedModules = calculateTotalCompletedModules(user);
  return {
    user,
    totalCompletedModules,
  };
}

// Usage example
const user: User = {
  id: 1,
  completedModules: [1, 2, 3],
};

const userWithTotalCompletedModules = createUserWithTotalCompletedModules(user);

if (userWithTotalCompletedModules.totalCompletedModules !== undefined) {
  console.log(userWithTotalCompletedModules); // { user: { id: 1, completedModules: [ 1, 2, 3 ] }, totalCompletedModules: 6 }
} else {
  console.error('Invalid user or completedModules');
}

import { User, UserWithTotalCompletedModules } from './User';

function isValidModule(module: User['completedModules'][number]): module is number {
  return typeof module === 'number' && module > 0;
}

function isValidUser(user: User): user is NonNullable<User> {
  return Array.isArray(user.completedModules) && user.completedModules.every(isValidModule);
}

function calculateTotalCompletedModules(user: User): number | undefined {
  if (!isValidUser(user)) {
    return undefined;
  }

  return user.completedModules.reduce((sum, module) => (isValidModule(module) ? sum + module : sum), 0);
}

interface UserWithTotalCompletedModules {
  user: User;
  totalCompletedModules?: number | undefined;
}

function createUserWithTotalCompletedModules(user: User): UserWithTotalCompletedModules {
  const totalCompletedModules = calculateTotalCompletedModules(user);
  return {
    user,
    totalCompletedModules,
  };
}

// Usage example
const user: User = {
  id: 1,
  completedModules: [1, 2, 3],
};

const userWithTotalCompletedModules = createUserWithTotalCompletedModules(user);

if (userWithTotalCompletedModules.totalCompletedModules !== undefined) {
  console.log(userWithTotalCompletedModules); // { user: { id: 1, completedModules: [ 1, 2, 3 ] }, totalCompletedModules: 6 }
} else {
  console.error('Invalid user or completedModules');
}