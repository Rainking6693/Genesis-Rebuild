import { FeatureFlag } from './FeatureFlag';

export interface FeatureFlag {
  id?: number;
  name: string;
  description: string;
  enabled: boolean;
}

export class FeatureFlagNotFoundError extends Error {
  constructor(flagName: string) {
    super(`Feature flag "${flagName}" not found.`);
  }
}

export class FeatureFlagValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class FeatureFlagManager {
  private static instance: FeatureFlagManager;

  private featureFlags: FeatureFlag[] = [];

  private constructor() {}

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public getAllFeatureFlags(): FeatureFlag[] {
    return this.featureFlags;
  }

  public hasFeatureFlag(name: string): boolean {
    return this.featureFlags.some((flag) => flag.name === name);
  }

  public getFeatureFlagByNameOrId(nameOrId: string | number): FeatureFlag | undefined {
    return this.featureFlags.find(
      (flag) => flag.name === nameOrId || flag.id === Number(nameOrId)
    );
  }

  public getFeatureFlagById(id: number): FeatureFlag | undefined {
    return this.featureFlags.find((flag) => flag.id === id);
  }

  public getFeatureFlagByName(name: string): FeatureFlag | undefined {
    return this.featureFlags.find((flag) => flag.name === name);
  }

  public toggleFeatureFlag(name: string, enabled: boolean): void {
    const flag = this.getFeatureFlagByNameOrId(name);
    if (flag) {
      flag.enabled = enabled;
    } else {
      throw new FeatureFlagNotFoundError(name);
    }
  }

  public addFeatureFlag(featureFlag: FeatureFlag): void {
    const validatedFeatureFlag = this.validateFeatureFlag(featureFlag);
    this.featureFlags.push(validatedFeatureFlag);
  }

  public updateFeatureFlag(nameOrId: string | number, updatedFeatureFlag: FeatureFlag): void {
    const flag = this.getFeatureFlagByNameOrId(nameOrId);
    if (flag) {
      const validatedFeatureFlag = this.validateFeatureFlag(updatedFeatureFlag);
      Object.assign(flag, validatedFeatureFlag);
    } else {
      throw new FeatureFlagNotFoundError(nameOrId.toString());
    }
  }

  public deleteFeatureFlag(nameOrId: string | number): void {
    const flag = this.getFeatureFlagByNameOrId(nameOrId);
    if (flag) {
      this.featureFlags = this.featureFlags.filter((flag) => flag.name !== flag.name);
    } else {
      throw new FeatureFlagNotFoundError(nameOrId.toString());
    }
  }

  private validateFeatureFlag(featureFlag: FeatureFlag): FeatureFlag {
    if (!featureFlag.name || !featureFlag.description || typeof featureFlag.enabled !== 'boolean') {
      throw new FeatureFlagValidationError('Invalid feature flag');
    }
    return featureFlag;
  }
}

const featureFlagManager = FeatureFlagManager.getInstance();
export default featureFlagManager;

import { FeatureFlag } from './FeatureFlag';

export interface FeatureFlag {
  id?: number;
  name: string;
  description: string;
  enabled: boolean;
}

export class FeatureFlagNotFoundError extends Error {
  constructor(flagName: string) {
    super(`Feature flag "${flagName}" not found.`);
  }
}

export class FeatureFlagValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class FeatureFlagManager {
  private static instance: FeatureFlagManager;

  private featureFlags: FeatureFlag[] = [];

  private constructor() {}

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public getAllFeatureFlags(): FeatureFlag[] {
    return this.featureFlags;
  }

  public hasFeatureFlag(name: string): boolean {
    return this.featureFlags.some((flag) => flag.name === name);
  }

  public getFeatureFlagByNameOrId(nameOrId: string | number): FeatureFlag | undefined {
    return this.featureFlags.find(
      (flag) => flag.name === nameOrId || flag.id === Number(nameOrId)
    );
  }

  public getFeatureFlagById(id: number): FeatureFlag | undefined {
    return this.featureFlags.find((flag) => flag.id === id);
  }

  public getFeatureFlagByName(name: string): FeatureFlag | undefined {
    return this.featureFlags.find((flag) => flag.name === name);
  }

  public toggleFeatureFlag(name: string, enabled: boolean): void {
    const flag = this.getFeatureFlagByNameOrId(name);
    if (flag) {
      flag.enabled = enabled;
    } else {
      throw new FeatureFlagNotFoundError(name);
    }
  }

  public addFeatureFlag(featureFlag: FeatureFlag): void {
    const validatedFeatureFlag = this.validateFeatureFlag(featureFlag);
    this.featureFlags.push(validatedFeatureFlag);
  }

  public updateFeatureFlag(nameOrId: string | number, updatedFeatureFlag: FeatureFlag): void {
    const flag = this.getFeatureFlagByNameOrId(nameOrId);
    if (flag) {
      const validatedFeatureFlag = this.validateFeatureFlag(updatedFeatureFlag);
      Object.assign(flag, validatedFeatureFlag);
    } else {
      throw new FeatureFlagNotFoundError(nameOrId.toString());
    }
  }

  public deleteFeatureFlag(nameOrId: string | number): void {
    const flag = this.getFeatureFlagByNameOrId(nameOrId);
    if (flag) {
      this.featureFlags = this.featureFlags.filter((flag) => flag.name !== flag.name);
    } else {
      throw new FeatureFlagNotFoundError(nameOrId.toString());
    }
  }

  private validateFeatureFlag(featureFlag: FeatureFlag): FeatureFlag {
    if (!featureFlag.name || !featureFlag.description || typeof featureFlag.enabled !== 'boolean') {
      throw new FeatureFlagValidationError('Invalid feature flag');
    }
    return featureFlag;
  }
}

const featureFlagManager = FeatureFlagManager.getInstance();
export default featureFlagManager;