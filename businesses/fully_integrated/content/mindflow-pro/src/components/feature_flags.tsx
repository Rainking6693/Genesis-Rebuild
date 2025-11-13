import React, { createContext, useContext, ReactNode } from 'react';
import { useFeatureFlag } from '@mindflow-pro/feature-flags';

// Create a default FeatureFlagContext value
const FeatureFlagContextDefault = {
  // Empty object to avoid any potential issues when the context is not provided
  ...{},
};

// Create a FeatureFlagContext
const FeatureFlagContext = createContext(FeatureFlagContextDefault);

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
};

// Ensure the flagKey is a non-empty string
const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Default content', accessibilityLabel }) => {
  // Use the useContext hook to access the FeatureFlagContext directly
  const context = useContext(FeatureFlagContext);

  // Check if the context is provided at the highest level of the component tree
  if (!context) {
    throw new Error('FeatureFlagContext must be provided at the highest level of the component tree');
  }

  const { isEnabled } = useFeatureFlag(flagKey, { context });

  if (isEnabled) {
    return <div role="presentation" aria-label={accessibilityLabel}>{message}</div>;
  }

  return <div role="presentation" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
};

// Default accessibilityLabel to an empty string
MyComponent.defaultProps = {
  accessibilityLabel: '',
};

// Wrap the MyComponent with the FeatureFlagContext to make it available to the component
export const FeatureFlagProvider = ({ children }) => {
  return <FeatureFlagContext.Provider value={children}>{children}</FeatureFlagContext.Provider>;
};

export default MyComponent;

import React, { createContext, useContext, ReactNode } from 'react';
import { useFeatureFlag } from '@mindflow-pro/feature-flags';

// Create a default FeatureFlagContext value
const FeatureFlagContextDefault = {
  // Empty object to avoid any potential issues when the context is not provided
  ...{},
};

// Create a FeatureFlagContext
const FeatureFlagContext = createContext(FeatureFlagContextDefault);

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
};

// Ensure the flagKey is a non-empty string
const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Default content', accessibilityLabel }) => {
  // Use the useContext hook to access the FeatureFlagContext directly
  const context = useContext(FeatureFlagContext);

  // Check if the context is provided at the highest level of the component tree
  if (!context) {
    throw new Error('FeatureFlagContext must be provided at the highest level of the component tree');
  }

  const { isEnabled } = useFeatureFlag(flagKey, { context });

  if (isEnabled) {
    return <div role="presentation" aria-label={accessibilityLabel}>{message}</div>;
  }

  return <div role="presentation" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
};

// Default accessibilityLabel to an empty string
MyComponent.defaultProps = {
  accessibilityLabel: '',
};

// Wrap the MyComponent with the FeatureFlagContext to make it available to the component
export const FeatureFlagProvider = ({ children }) => {
  return <FeatureFlagContext.Provider value={children}>{children}</FeatureFlagContext.Provider>;
};

export default MyComponent;