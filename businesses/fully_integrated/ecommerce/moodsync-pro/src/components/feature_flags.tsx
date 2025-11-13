import React, { createContext, useState } from 'react';

interface FeatureFlagContextValue {
  isFeatureEnabled: (featureName: string) => boolean;
  updateFeatureFlags: (newFeatureFlags: Record<string, boolean>) => void;
}

const FeatureFlagContextDefaultValue: FeatureFlagContextValue = {
  isFeatureEnabled: () => false,
  updateFeatureFlags: () => {},
};

const FeatureFlagContext = createContext<FeatureFlagContextValue>(FeatureFlagContextDefaultValue);

// ... rest of the code remains the same

import React, { useState } from 'react';
import { FeatureFlagContext, FeatureFlagContextDefaultValue } from './FeatureFlagContext';

interface Props {
  defaultFeatureFlags?: Record<string, boolean>;
  children: React.ReactNode;
}

const FeatureFlagProvider: React.FC<Props> = ({ defaultFeatureFlags = {}, children }) => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({ ...FeatureFlagContextDefaultValue.isFeatureEnabled, ...defaultFeatureFlags });

  const isFeatureEnabled = (featureName: string) => {
    return featureFlags[featureName] || FeatureFlagContextDefaultValue.isFeatureEnabled(featureName);
  };

  const updateFeatureFlags = (newFeatureFlags: Record<string, boolean>) => {
    setFeatureFlags(newFeatureFlags);
  };

  return (
    <FeatureFlagContext.Provider value={{ isFeatureEnabled, updateFeatureFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export { FeatureFlagProvider, FeatureFlagContext };

import React from 'react';
import { FeatureFlagContext } from './FeatureFlagContext';

interface Props {
  componentName: string;
}

const MyComponent: React.FC<Props> = ({ componentName }) => {
  const { isFeatureEnabled } = React.useContext(FeatureFlagContext);

  if (!isFeatureEnabled(componentName)) {
    return null;
  }

  const message = getComponentMessage(componentName);

  return (
    <div data-testid={`${componentName}-message`}>
      {message}
      <a href="#" aria-label={`Learn more about the ${componentName} feature`}>Learn more</a>
    </div>
  );
};

function getComponentMessage(componentName: string) {
  const defaultMessage = 'This feature is currently unavailable.';
  const message = messages[componentName] || defaultMessage;
  return message;
}

const messages = {
  MoodSyncProFeature: 'Welcome to MoodSync Pro!',
  // Add more messages for other components
};

export default MyComponent;

import React, { createContext, useState } from 'react';

interface FeatureFlagContextValue {
  isFeatureEnabled: (featureName: string) => boolean;
  updateFeatureFlags: (newFeatureFlags: Record<string, boolean>) => void;
}

const FeatureFlagContextDefaultValue: FeatureFlagContextValue = {
  isFeatureEnabled: () => false,
  updateFeatureFlags: () => {},
};

const FeatureFlagContext = createContext<FeatureFlagContextValue>(FeatureFlagContextDefaultValue);

// ... rest of the code remains the same

import React, { useState } from 'react';
import { FeatureFlagContext, FeatureFlagContextDefaultValue } from './FeatureFlagContext';

interface Props {
  defaultFeatureFlags?: Record<string, boolean>;
  children: React.ReactNode;
}

const FeatureFlagProvider: React.FC<Props> = ({ defaultFeatureFlags = {}, children }) => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({ ...FeatureFlagContextDefaultValue.isFeatureEnabled, ...defaultFeatureFlags });

  const isFeatureEnabled = (featureName: string) => {
    return featureFlags[featureName] || FeatureFlagContextDefaultValue.isFeatureEnabled(featureName);
  };

  const updateFeatureFlags = (newFeatureFlags: Record<string, boolean>) => {
    setFeatureFlags(newFeatureFlags);
  };

  return (
    <FeatureFlagContext.Provider value={{ isFeatureEnabled, updateFeatureFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export { FeatureFlagProvider, FeatureFlagContext };

import React from 'react';
import { FeatureFlagContext } from './FeatureFlagContext';

interface Props {
  componentName: string;
}

const MyComponent: React.FC<Props> = ({ componentName }) => {
  const { isFeatureEnabled } = React.useContext(FeatureFlagContext);

  if (!isFeatureEnabled(componentName)) {
    return null;
  }

  const message = getComponentMessage(componentName);

  return (
    <div data-testid={`${componentName}-message`}>
      {message}
      <a href="#" aria-label={`Learn more about the ${componentName} feature`}>Learn more</a>
    </div>
  );
};

function getComponentMessage(componentName: string) {
  const defaultMessage = 'This feature is currently unavailable.';
  const message = messages[componentName] || defaultMessage;
  return message;
}

const messages = {
  MoodSyncProFeature: 'Welcome to MoodSync Pro!',
  // Add more messages for other components
};

export default MyComponent;

// FeatureFlagProvider.tsx

// MyComponent.tsx