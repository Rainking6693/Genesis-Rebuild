// FeatureFlag.ts
export interface FeatureFlag {
  key: string;
  description: string;
  isEnabled: () => boolean;
  setEnabled: (enabled: boolean) => void;

  // Add a default description for new flags
  constructor(key: string, description?: string) {
    this.key = key;
    this.description = description || `No description provided for feature flag "${key}"`;
  }
}

// FeatureFlags.ts
import { FeatureFlag } from './FeatureFlag';

export class FeatureFlags {
  private flags: Map<string, FeatureFlag>;

  constructor() {
    this.flags = new Map();
  }

  public addFeatureFlag(key: string, flag: FeatureFlag): void {
    if (!flag.isEnabled) {
      throw new Error('FeatureFlag must implement isEnabled method');
    }
    if (!flag.setEnabled) {
      throw new Error('FeatureFlag must implement setEnabled method');
    }
    this.flags.set(key, flag);
  }

  public getFeatureFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  public toggleFeatureFlag(key: string, enabled: boolean): void {
    const flag = this.getFeatureFlag(key);
    if (!flag) {
      throw new Error(`Feature flag with key "${key}" not found`);
    }
    flag.setEnabled(enabled);
  }

  public isFeatureEnabled(key: string): boolean {
    const flag = this.getFeatureFlag(key);
    return flag?.isEnabled() || false;
  }

  // Add a method to check if a feature flag exists before toggling it
  public safeToggleFeatureFlag(key: string, enabled: boolean): void {
    const flag = this.getFeatureFlag(key);
    if (flag) {
      this.toggleFeatureFlag(key, enabled);
    } else {
      console.warn(`Feature flag with key "${key}" not found. Skipping toggle.`);
    }
  }
}

// FeatureFlag.ts
export interface FeatureFlag {
  key: string;
  description: string;
  isEnabled: () => boolean;
  setEnabled: (enabled: boolean) => void;

  // Add a default description for new flags
  constructor(key: string, description?: string) {
    this.key = key;
    this.description = description || `No description provided for feature flag "${key}"`;
  }
}

// FeatureFlags.ts
import { FeatureFlag } from './FeatureFlag';

export class FeatureFlags {
  private flags: Map<string, FeatureFlag>;

  constructor() {
    this.flags = new Map();
  }

  public addFeatureFlag(key: string, flag: FeatureFlag): void {
    if (!flag.isEnabled) {
      throw new Error('FeatureFlag must implement isEnabled method');
    }
    if (!flag.setEnabled) {
      throw new Error('FeatureFlag must implement setEnabled method');
    }
    this.flags.set(key, flag);
  }

  public getFeatureFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  public toggleFeatureFlag(key: string, enabled: boolean): void {
    const flag = this.getFeatureFlag(key);
    if (!flag) {
      throw new Error(`Feature flag with key "${key}" not found`);
    }
    flag.setEnabled(enabled);
  }

  public isFeatureEnabled(key: string): boolean {
    const flag = this.getFeatureFlag(key);
    return flag?.isEnabled() || false;
  }

  // Add a method to check if a feature flag exists before toggling it
  public safeToggleFeatureFlag(key: string, enabled: boolean): void {
    const flag = this.getFeatureFlag(key);
    if (flag) {
      this.toggleFeatureFlag(key, enabled);
    } else {
      console.warn(`Feature flag with key "${key}" not found. Skipping toggle.`);
    }
  }
}