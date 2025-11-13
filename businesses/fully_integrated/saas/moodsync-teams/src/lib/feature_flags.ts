type FeatureCategory = 'mentalHealth' | 'productivity' | 'burnout' | 'wellbeing' | 'teamDynamics' | 'remoteWorkforce' | 'hybridWorkforce';
type FeatureFlag = boolean;

const FEATURE_CATEGORY_MENTAL_HEALTH = 'mentalHealth';
const FEATURE_CATEGORY_PRODUCTIVITY = 'productivity';
const FEATURE_CATEGORY_BURNOUT = 'burnout';
const FEATURE_CATEGORY_WELLBEING = 'wellbeing';
const FEATURE_CATEGORY_TEAM_DYNAMICS = 'teamDynamics';
const FEATURE_CATEGORY_REMOTE_WORKFORCE = 'remoteWorkforce';
const FEATURE_CATEGORY_HYBRID_WORKFORCE = 'hybridWorkforce';

const featureFlags: Record<FeatureCategory, Record<string, FeatureFlag>> = {
  [FEATURE_CATEGORY_MENTAL_HEALTH]: {
    mentalHealthMonitoring: true,
  },
  [FEATURE_CATEGORY_PRODUCTIVITY]: {
    productivityInsights: true,
  },
  [FEATURE_CATEGORY_BURNOUT]: {
    burnoutPrediction: true,
  },
  [FEATURE_CATEGORY_WELLBEING]: {
    wellbeingInterventions: true,
  },
  [FEATURE_CATEGORY_TEAM_DYNAMICS]: {
    teamDynamicsOptimization: true,
  },
  [FEATURE_CATEGORY_REMOTE_WORKFORCE]: {
    remoteWorkforceSupport: true,
  },
  [FEATURE_CATEGORY_HYBRID_WORKFORCE]: {
    hybridWorkforceSupport: true,
  },
};

function getFeatureFlagByCategoryAndName(category: FeatureCategory, flagName: string): FeatureFlag {
  // Ensure the provided category and flagName are valid
  if (!featureFlags[category]) {
    throw new Error(`Invalid feature category: ${category}`);
  }

  const flag = featureFlags[category][flagName];

  // Use default value for edge cases where a flag might not be defined
  return flag || false;
}

// Example usage:
const mentalHealthMonitoring = getFeatureFlagByCategoryAndName(FEATURE_CATEGORY_MENTAL_HEALTH, 'mentalHealthMonitoring');

type FeatureCategory = 'mentalHealth' | 'productivity' | 'burnout' | 'wellbeing' | 'teamDynamics' | 'remoteWorkforce' | 'hybridWorkforce';
type FeatureFlag = boolean;

const FEATURE_CATEGORY_MENTAL_HEALTH = 'mentalHealth';
const FEATURE_CATEGORY_PRODUCTIVITY = 'productivity';
const FEATURE_CATEGORY_BURNOUT = 'burnout';
const FEATURE_CATEGORY_WELLBEING = 'wellbeing';
const FEATURE_CATEGORY_TEAM_DYNAMICS = 'teamDynamics';
const FEATURE_CATEGORY_REMOTE_WORKFORCE = 'remoteWorkforce';
const FEATURE_CATEGORY_HYBRID_WORKFORCE = 'hybridWorkforce';

const featureFlags: Record<FeatureCategory, Record<string, FeatureFlag>> = {
  [FEATURE_CATEGORY_MENTAL_HEALTH]: {
    mentalHealthMonitoring: true,
  },
  [FEATURE_CATEGORY_PRODUCTIVITY]: {
    productivityInsights: true,
  },
  [FEATURE_CATEGORY_BURNOUT]: {
    burnoutPrediction: true,
  },
  [FEATURE_CATEGORY_WELLBEING]: {
    wellbeingInterventions: true,
  },
  [FEATURE_CATEGORY_TEAM_DYNAMICS]: {
    teamDynamicsOptimization: true,
  },
  [FEATURE_CATEGORY_REMOTE_WORKFORCE]: {
    remoteWorkforceSupport: true,
  },
  [FEATURE_CATEGORY_HYBRID_WORKFORCE]: {
    hybridWorkforceSupport: true,
  },
};

function getFeatureFlagByCategoryAndName(category: FeatureCategory, flagName: string): FeatureFlag {
  // Ensure the provided category and flagName are valid
  if (!featureFlags[category]) {
    throw new Error(`Invalid feature category: ${category}`);
  }

  const flag = featureFlags[category][flagName];

  // Use default value for edge cases where a flag might not be defined
  return flag || false;
}

// Example usage:
const mentalHealthMonitoring = getFeatureFlagByCategoryAndName(FEATURE_CATEGORY_MENTAL_HEALTH, 'mentalHealthMonitoring');