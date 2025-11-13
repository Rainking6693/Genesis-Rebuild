import React, { useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, IFeatureFlagContext } from '@moodboard/feature-flags';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const defaultProps: Partial<Props> = {
  fallbackMessage: 'Feature is disabled',
  fallbackComponent: <div>{fallbackMessage}</div>,
};

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = defaultProps.fallbackMessage, fallbackComponent = defaultProps.fallbackComponent, ...rest }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const { isLoaded, error } = useFeatureFlag('MENTAL_HEALTH_INTERVENTIONS', { defaultValue: false });

  useEffect(() => {
    if (isLoaded && !isFeatureEnabled) {
      setIsFeatureEnabled(false);
    }
  }, [isLoaded, isFeatureEnabled]);

  const loadingMessage = isLoaded ? (isFeatureEnabled ? message : fallbackMessage) : 'Loading feature flag...';

  const loadingComponent = (
    <div {...rest}>
      <span id="loading-message">{loadingMessage}</span>
    </div>
  );

  if (error) {
    return fallbackComponent;
  }

  return isLoaded ? (
    <div {...rest}>
      {isFeatureEnabled ? (
        <div>{message}</div>
      ) : (
        <div role="alert">{fallbackMessage}</div>
      )}
    </div>
  ) : loadingComponent;
};

export default MyComponent;

import React, { useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, IFeatureFlagContext } from '@moodboard/feature-flags';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const defaultProps: Partial<Props> = {
  fallbackMessage: 'Feature is disabled',
  fallbackComponent: <div>{fallbackMessage}</div>,
};

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = defaultProps.fallbackMessage, fallbackComponent = defaultProps.fallbackComponent, ...rest }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const { isLoaded, error } = useFeatureFlag('MENTAL_HEALTH_INTERVENTIONS', { defaultValue: false });

  useEffect(() => {
    if (isLoaded && !isFeatureEnabled) {
      setIsFeatureEnabled(false);
    }
  }, [isLoaded, isFeatureEnabled]);

  const loadingMessage = isLoaded ? (isFeatureEnabled ? message : fallbackMessage) : 'Loading feature flag...';

  const loadingComponent = (
    <div {...rest}>
      <span id="loading-message">{loadingMessage}</span>
    </div>
  );

  if (error) {
    return fallbackComponent;
  }

  return isLoaded ? (
    <div {...rest}>
      {isFeatureEnabled ? (
        <div>{message}</div>
      ) : (
        <div role="alert">{fallbackMessage}</div>
      )}
    </div>
  ) : loadingComponent;
};

export default MyComponent;