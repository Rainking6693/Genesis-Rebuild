import { v4 as uuidv4 } from 'uuid';

type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  isEnabledByDefault: boolean;
  enabledUsers: Set<string>;
  enabledTeams: Set<string>;

  checkIsEnabledFor(userId: string | null, teamId: string | null): boolean {
    if (this.isEnabledByDefault) return true;

    if (userId && !this.enabledUsers.has(userId)) return false;
    if (teamId && !this.enabledTeams.has(teamId)) return false;

    return true;
  }

  enableFor(userId: string | null, teamId: string | null): Promise<void> {
    if (userId) this.enabledUsers.add(userId);
    if (teamId) this.enabledTeams.add(teamId);

    return new Promise((resolve, reject) => {
      // Implement logic to enable the feature for the given user or team.
      // If there's an error, reject the promise with an error message.
      resolve();
    });
  }

  disableFor(userId: string | null, teamId: string | null): Promise<void> {
    if (userId) this.enabledUsers.delete(userId);
    if (teamId) this.enabledTeams.delete(teamId);

    return new Promise((resolve, reject) => {
      // Implement logic to disable the feature for the given user or team.
      // If there's an error, reject the promise with an error message.
      resolve();
    });
  }
}

function createFeatureFlag(id: string, name: string, description: string, isEnabledByDefault: boolean): FeatureFlag {
  const featureFlag: FeatureFlag = {
    id,
    name,
    description,
    isEnabledByDefault,
    enabledUsers: new Set(),
    enabledTeams: new Set(),
  };

  return featureFlag;
}

// Add a function to get all enabled users and teams for a feature flag
function getEnabledUsersAndTeams(featureFlag: FeatureFlag): { enabledUsers: Set<string>; enabledTeams: Set<string> } {
  return {
    enabledUsers: featureFlag.enabledUsers,
    enabledTeams: featureFlag.enabledTeams,
  };
}

// Add a function to check if a user or team is enabled for a feature flag
function isEnabledFor(featureFlag: FeatureFlag, userId: string | null, teamId: string | null): boolean {
  return featureFlag.checkIsEnabledFor(userId, teamId);
}

// Add a function to check if a feature flag is enabled by default
function isEnabledByDefault(featureFlag: FeatureFlag): boolean {
  return featureFlag.isEnabledByDefault;
}

// Add a function to check if a feature flag has any enabled users or teams
function hasEnabledUsersOrTeams(featureFlag: FeatureFlag): boolean {
  return featureFlag.enabledUsers.size > 0 || featureFlag.enabledTeams.size > 0;
}

// Add a function to check if a feature flag is enabled for a specific user or team
function isEnabledForUserOrTeam(featureFlag: FeatureFlag, userId: string | null, teamId: string | null): boolean {
  return featureFlag.checkIsEnabledFor(userId, teamId) || featureFlag.isEnabledByDefault;
}

import { v4 as uuidv4 } from 'uuid';

type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  isEnabledByDefault: boolean;
  enabledUsers: Set<string>;
  enabledTeams: Set<string>;

  checkIsEnabledFor(userId: string | null, teamId: string | null): boolean {
    if (this.isEnabledByDefault) return true;

    if (userId && !this.enabledUsers.has(userId)) return false;
    if (teamId && !this.enabledTeams.has(teamId)) return false;

    return true;
  }

  enableFor(userId: string | null, teamId: string | null): Promise<void> {
    if (userId) this.enabledUsers.add(userId);
    if (teamId) this.enabledTeams.add(teamId);

    return new Promise((resolve, reject) => {
      // Implement logic to enable the feature for the given user or team.
      // If there's an error, reject the promise with an error message.
      resolve();
    });
  }

  disableFor(userId: string | null, teamId: string | null): Promise<void> {
    if (userId) this.enabledUsers.delete(userId);
    if (teamId) this.enabledTeams.delete(teamId);

    return new Promise((resolve, reject) => {
      // Implement logic to disable the feature for the given user or team.
      // If there's an error, reject the promise with an error message.
      resolve();
    });
  }
}

function createFeatureFlag(id: string, name: string, description: string, isEnabledByDefault: boolean): FeatureFlag {
  const featureFlag: FeatureFlag = {
    id,
    name,
    description,
    isEnabledByDefault,
    enabledUsers: new Set(),
    enabledTeams: new Set(),
  };

  return featureFlag;
}

// Add a function to get all enabled users and teams for a feature flag
function getEnabledUsersAndTeams(featureFlag: FeatureFlag): { enabledUsers: Set<string>; enabledTeams: Set<string> } {
  return {
    enabledUsers: featureFlag.enabledUsers,
    enabledTeams: featureFlag.enabledTeams,
  };
}

// Add a function to check if a user or team is enabled for a feature flag
function isEnabledFor(featureFlag: FeatureFlag, userId: string | null, teamId: string | null): boolean {
  return featureFlag.checkIsEnabledFor(userId, teamId);
}

// Add a function to check if a feature flag is enabled by default
function isEnabledByDefault(featureFlag: FeatureFlag): boolean {
  return featureFlag.isEnabledByDefault;
}

// Add a function to check if a feature flag has any enabled users or teams
function hasEnabledUsersOrTeams(featureFlag: FeatureFlag): boolean {
  return featureFlag.enabledUsers.size > 0 || featureFlag.enabledTeams.size > 0;
}

// Add a function to check if a feature flag is enabled for a specific user or team
function isEnabledForUserOrTeam(featureFlag: FeatureFlag, userId: string | null, teamId: string | null): boolean {
  return featureFlag.checkIsEnabledFor(userId, teamId) || featureFlag.isEnabledByDefault;
}