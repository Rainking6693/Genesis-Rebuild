import { FeatureFlag, IFeatureFlag } from '@genesis/feature-flags-library';

// Define an interface for the feature flags to ensure type safety
interface IFeatureFlag {
  name: string;
  isEnabled: boolean;
}

// Define a validation function for feature flag names
const validateFeatureFlagName = (name: string): name is FeatureFlag['name'] =>
  typeof name === 'string' && name.length > 0;

// Define a FeatureFlag class with a validation function
class FeatureFlag implements IFeatureFlag {
  name: string;
  isEnabled: boolean;

  constructor(name: string, isEnabled: boolean) {
    if (!validateFeatureFlagName(name)) {
      console.warn(`Invalid feature flag name: ${name}`);
      throw new Error('Invalid feature flag name');
    }
    this.name = name;
    this.isEnabled = isEnabled;
  }

  setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
  }

  isEnabled(): boolean {
    return this.isEnabled;
  }
}

// Define a FeatureFlagGroup class to group related feature flags
class FeatureFlagGroup {
  private flags: Map<string, FeatureFlag>;

  constructor(name: string) {
    this.flags = new Map<string, FeatureFlag>();
    this.name = name;
  }

  addFlag(name: string, isEnabled: boolean): void {
    this.flags.set(name, new FeatureFlag(name, isEnabled));
  }

  getFlag(name: string): FeatureFlag | undefined {
    return this.flags.get(name);
  }

  getAllFlags(): Map<string, FeatureFlag> {
    return this.flags;
  }

  getName(): string {
    return this.name;
  }
}

// Define a FeatureFlagManager class to handle the creation, retrieval, and management of feature flags
class FeatureFlagManager {
  private groups: Map<string, FeatureFlagGroup>;

  constructor() {
    this.groups = new Map<string, FeatureFlagGroup>();
  }

  createGroup(name: string): FeatureFlagGroup {
    if (this.groups.has(name)) {
      console.warn(`Feature flag group "${name}" already exists.`);
      throw new Error('Feature flag group already exists');
    }
    const group = new FeatureFlagGroup(name);
    this.groups.set(name, group);
    return group;
  }

  getGroup(name: string): FeatureFlagGroup | undefined {
    return this.groups.get(name);
  }

  getFeatureFlagByName(name: string, validateName?: (name: string) => name is FeatureFlag['name']): FeatureFlag | undefined {
    const group = this.getGroup(name.split('_')[0]);
    return group ? group.getFlag(name) : undefined;
  }

  getAllFeatureFlags(): Map<string, FeatureFlag> {
    const allFlags: Map<string, FeatureFlag> = new Map<string, FeatureFlag>();
    this.groups.forEach((group) => {
      group.getAllFlags().forEach((flag) => {
        allFlags.set(flag.name, flag);
      });
    });
    return allFlags;
  }
}

// Create a FeatureFlagManager instance
const featureFlagManager = new FeatureFlagManager();

// Define feature flags for the Test E-Commerce Store
export const TEST_ECOMMERCE_FEATURE_GROUP = featureFlagManager.createGroup('TestECommerce');
TEST_ECOMMERCE_FEATURE_GROUP.addFlag('NEW_PRODUCT_FEATURE', false);

// Function to retrieve a feature flag by its name
export function getFeatureFlag(name: string): FeatureFlag | undefined {
  return featureFlagManager.getFeatureFlagByName(name);
}

// Function to check if a feature flag is enabled
export function isFeatureEnabled(name: string): boolean {
  const flag = getFeatureFlag(name);
  return flag ? flag.isEnabled() : false;
}

// Function to enable/disable a feature flag
export function setFeatureEnabled(name: string, isEnabled: boolean): void {
  const flag = getFeatureFlag(name);
  if (flag) {
    flag.setEnabled(isEnabled);
  } else {
    console.warn(`Feature flag "${name}" does not exist.`);
  }
}

// Add a function to get all feature flags for better maintainability
export function getAllFeatureFlags(): Map<string, FeatureFlag> {
  return featureFlagManager.getAllFeatureFlags();
}

// Add a function to check if all feature flags are enabled for edge cases
export function areAllFeaturesEnabled(): boolean {
  const allFlags = getAllFeatureFlags();
  return Object.values(allFlags).every((flag) => flag.isEnabled());
}

// Create a context provider for feature flags
import React, { createContext, useContext } from 'react';

type FeatureFlagContextType = {
  getFeatureFlag: (name: string) => FeatureFlag | undefined;
  isFeatureEnabled: (name: string) => boolean;
  setFeatureEnabled: (name: string, isEnabled: boolean) => void;
  getAllFeatureFlags: () => Map<string, FeatureFlag>;
  areAllFeaturesEnabled: () => boolean;
};

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  getFeatureFlag: () => undefined,
  isFeatureEnabled: () => false,
  setFeatureEnabled: () => {},
  getAllFeatureFlags: () => new Map(),
  areAllFeaturesEnabled: () => false,
});

export const FeatureFlagProvider = FeatureFlagContext.Provider;
export const useFeatureFlags = () => useContext(FeatureFlagContext);

import { FeatureFlag, IFeatureFlag } from '@genesis/feature-flags-library';

// Define an interface for the feature flags to ensure type safety
interface IFeatureFlag {
  name: string;
  isEnabled: boolean;
}

// Define a validation function for feature flag names
const validateFeatureFlagName = (name: string): name is FeatureFlag['name'] =>
  typeof name === 'string' && name.length > 0;

// Define a FeatureFlag class with a validation function
class FeatureFlag implements IFeatureFlag {
  name: string;
  isEnabled: boolean;

  constructor(name: string, isEnabled: boolean) {
    if (!validateFeatureFlagName(name)) {
      console.warn(`Invalid feature flag name: ${name}`);
      throw new Error('Invalid feature flag name');
    }
    this.name = name;
    this.isEnabled = isEnabled;
  }

  setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
  }

  isEnabled(): boolean {
    return this.isEnabled;
  }
}

// Define a FeatureFlagGroup class to group related feature flags
class FeatureFlagGroup {
  private flags: Map<string, FeatureFlag>;

  constructor(name: string) {
    this.flags = new Map<string, FeatureFlag>();
    this.name = name;
  }

  addFlag(name: string, isEnabled: boolean): void {
    this.flags.set(name, new FeatureFlag(name, isEnabled));
  }

  getFlag(name: string): FeatureFlag | undefined {
    return this.flags.get(name);
  }

  getAllFlags(): Map<string, FeatureFlag> {
    return this.flags;
  }

  getName(): string {
    return this.name;
  }
}

// Define a FeatureFlagManager class to handle the creation, retrieval, and management of feature flags
class FeatureFlagManager {
  private groups: Map<string, FeatureFlagGroup>;

  constructor() {
    this.groups = new Map<string, FeatureFlagGroup>();
  }

  createGroup(name: string): FeatureFlagGroup {
    if (this.groups.has(name)) {
      console.warn(`Feature flag group "${name}" already exists.`);
      throw new Error('Feature flag group already exists');
    }
    const group = new FeatureFlagGroup(name);
    this.groups.set(name, group);
    return group;
  }

  getGroup(name: string): FeatureFlagGroup | undefined {
    return this.groups.get(name);
  }

  getFeatureFlagByName(name: string, validateName?: (name: string) => name is FeatureFlag['name']): FeatureFlag | undefined {
    const group = this.getGroup(name.split('_')[0]);
    return group ? group.getFlag(name) : undefined;
  }

  getAllFeatureFlags(): Map<string, FeatureFlag> {
    const allFlags: Map<string, FeatureFlag> = new Map<string, FeatureFlag>();
    this.groups.forEach((group) => {
      group.getAllFlags().forEach((flag) => {
        allFlags.set(flag.name, flag);
      });
    });
    return allFlags;
  }
}

// Create a FeatureFlagManager instance
const featureFlagManager = new FeatureFlagManager();

// Define feature flags for the Test E-Commerce Store
export const TEST_ECOMMERCE_FEATURE_GROUP = featureFlagManager.createGroup('TestECommerce');
TEST_ECOMMERCE_FEATURE_GROUP.addFlag('NEW_PRODUCT_FEATURE', false);

// Function to retrieve a feature flag by its name
export function getFeatureFlag(name: string): FeatureFlag | undefined {
  return featureFlagManager.getFeatureFlagByName(name);
}

// Function to check if a feature flag is enabled
export function isFeatureEnabled(name: string): boolean {
  const flag = getFeatureFlag(name);
  return flag ? flag.isEnabled() : false;
}

// Function to enable/disable a feature flag
export function setFeatureEnabled(name: string, isEnabled: boolean): void {
  const flag = getFeatureFlag(name);
  if (flag) {
    flag.setEnabled(isEnabled);
  } else {
    console.warn(`Feature flag "${name}" does not exist.`);
  }
}

// Add a function to get all feature flags for better maintainability
export function getAllFeatureFlags(): Map<string, FeatureFlag> {
  return featureFlagManager.getAllFeatureFlags();
}

// Add a function to check if all feature flags are enabled for edge cases
export function areAllFeaturesEnabled(): boolean {
  const allFlags = getAllFeatureFlags();
  return Object.values(allFlags).every((flag) => flag.isEnabled());
}

// Create a context provider for feature flags
import React, { createContext, useContext } from 'react';

type FeatureFlagContextType = {
  getFeatureFlag: (name: string) => FeatureFlag | undefined;
  isFeatureEnabled: (name: string) => boolean;
  setFeatureEnabled: (name: string, isEnabled: boolean) => void;
  getAllFeatureFlags: () => Map<string, FeatureFlag>;
  areAllFeaturesEnabled: () => boolean;
};

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  getFeatureFlag: () => undefined,
  isFeatureEnabled: () => false,
  setFeatureEnabled: () => {},
  getAllFeatureFlags: () => new Map(),
  areAllFeaturesEnabled: () => false,
});

export const FeatureFlagProvider = FeatureFlagContext.Provider;
export const useFeatureFlags = () => useContext(FeatureFlagContext);