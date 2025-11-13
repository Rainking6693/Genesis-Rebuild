import React from 'react';
import { FeatureFlagType } from './FeatureFlags';

type Props = {
  message: string;
  featureFlagName: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message = 'Default message', featureFlag, fallbackMessage = 'Feature is currently disabled.' }) => {
  if (!featureFlag.isEnabled) {
    return <div>{fallbackMessage}</div>;
  }

  return <div role="alert" aria-hidden={!featureFlag.isEnabled}>{message}</div>;
};

export default MyComponent;

// Add a type definition for FeatureFlagType
type FeatureFlagType = {
  name: string;
  isEnabled: boolean;
};

// Add a default value for isEnabled
type FeatureFlagTypeWithDefault = FeatureFlagType & {
  isEnabled?: boolean;
};

// Create a function to get a feature flag with a default value
const getFeatureFlag = (name: string, defaultValue: FeatureFlagTypeWithDefault = { isEnabled: false }): FeatureFlagType => {
  let storedFeatureFlag: FeatureFlagType | null = // Get the feature flag from local storage or any other persistent storage

  if (!storedFeatureFlag) {
    storedFeatureFlag = { ...defaultValue, name };
  }

  return storedFeatureFlag as FeatureFlagType;
};

// Use the getFeatureFlag function in MyComponent
const MyComponentWithDefaultValue: React.FC<Props> = ({ message, featureFlagName }) => {
  const featureFlag = getFeatureFlag(featureFlagName);
  return <MyComponent message={message} featureFlag={featureFlag} />;
};

export default MyComponentWithDefaultValue;

import React from 'react';
import { FeatureFlagType } from './FeatureFlags';

type Props = {
  message: string;
  featureFlagName: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message = 'Default message', featureFlag, fallbackMessage = 'Feature is currently disabled.' }) => {
  if (!featureFlag.isEnabled) {
    return <div>{fallbackMessage}</div>;
  }

  return <div role="alert" aria-hidden={!featureFlag.isEnabled}>{message}</div>;
};

export default MyComponent;

// Add a type definition for FeatureFlagType
type FeatureFlagType = {
  name: string;
  isEnabled: boolean;
};

// Add a default value for isEnabled
type FeatureFlagTypeWithDefault = FeatureFlagType & {
  isEnabled?: boolean;
};

// Create a function to get a feature flag with a default value
const getFeatureFlag = (name: string, defaultValue: FeatureFlagTypeWithDefault = { isEnabled: false }): FeatureFlagType => {
  let storedFeatureFlag: FeatureFlagType | null = // Get the feature flag from local storage or any other persistent storage

  if (!storedFeatureFlag) {
    storedFeatureFlag = { ...defaultValue, name };
  }

  return storedFeatureFlag as FeatureFlagType;
};

// Use the getFeatureFlag function in MyComponent
const MyComponentWithDefaultValue: React.FC<Props> = ({ message, featureFlagName }) => {
  const featureFlag = getFeatureFlag(featureFlagName);
  return <MyComponent message={message} featureFlag={featureFlag} />;
};

export default MyComponentWithDefaultValue;