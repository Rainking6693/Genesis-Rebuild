import React, { useContext, useState, useEffect } from 'react';
import { FeatureFlagContext, FeatureFlagContextData } from '../../contexts/FeatureFlagsContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface Props {
  message: string;
  fallbackMessage?: string;
  fallbackMessageAccessible?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'This feature is currently disabled.', fallbackMessageAccessible = 'Feature is disabled' }) => {
  const { isCarbonCompetitionEnabled, contextLoaded } = useContext(FeatureFlagContext) as FeatureFlagContextData;
  const [storedIsCarbonCompetitionEnabled, setStoredIsCarbonCompetitionEnabled] = useLocalStorage<boolean>('isCarbonCompetitionEnabled', false);

  // Check if the feature flag is available from the context or local storage
  const isFeatureEnabled = isCarbonCompetitionEnabled || storedIsCarbonCompetitionEnabled;

  // If the context is not loaded, use the local storage value
  const featureFlag = isCarbonCompetitionEnabled ? isCarbonCompetitionEnabled : storedIsCarbonCompetitionEnabled;

  // If the feature flag is not available, use the fallback message
  if (!featureFlag) {
    return <div>{fallbackMessage}</div>;
  }

  // Add a loading state to handle edge cases where the feature flag is not immediately available
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update the local storage and set the loading state to false when the feature flag is available
    if (contextLoaded && isCarbonCompetitionEnabled) {
      setStoredIsCarbonCompetitionEnabled(true);
      setIsLoading(false);
    }
  }, [contextLoaded, isCarbonCompetitionEnabled]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {message}
      {/* Provide a meaningful fallback message for screen readers */}
      <div aria-hidden={!isLoading}>{isLoading ? 'Loading...' : ''}</div>
      <div aria-label={fallbackMessageAccessible}>{isLoading ? '' : fallbackMessage}</div>
    </div>
  );
};

export default MyComponent;

import React, { useContext, useState, useEffect } from 'react';
import { FeatureFlagContext, FeatureFlagContextData } from '../../contexts/FeatureFlagsContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface Props {
  message: string;
  fallbackMessage?: string;
  fallbackMessageAccessible?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'This feature is currently disabled.', fallbackMessageAccessible = 'Feature is disabled' }) => {
  const { isCarbonCompetitionEnabled, contextLoaded } = useContext(FeatureFlagContext) as FeatureFlagContextData;
  const [storedIsCarbonCompetitionEnabled, setStoredIsCarbonCompetitionEnabled] = useLocalStorage<boolean>('isCarbonCompetitionEnabled', false);

  // Check if the feature flag is available from the context or local storage
  const isFeatureEnabled = isCarbonCompetitionEnabled || storedIsCarbonCompetitionEnabled;

  // If the context is not loaded, use the local storage value
  const featureFlag = isCarbonCompetitionEnabled ? isCarbonCompetitionEnabled : storedIsCarbonCompetitionEnabled;

  // If the feature flag is not available, use the fallback message
  if (!featureFlag) {
    return <div>{fallbackMessage}</div>;
  }

  // Add a loading state to handle edge cases where the feature flag is not immediately available
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update the local storage and set the loading state to false when the feature flag is available
    if (contextLoaded && isCarbonCompetitionEnabled) {
      setStoredIsCarbonCompetitionEnabled(true);
      setIsLoading(false);
    }
  }, [contextLoaded, isCarbonCompetitionEnabled]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {message}
      {/* Provide a meaningful fallback message for screen readers */}
      <div aria-hidden={!isLoading}>{isLoading ? 'Loading...' : ''}</div>
      <div aria-label={fallbackMessageAccessible}>{isLoading ? '' : fallbackMessage}</div>
    </div>
  );
};

export default MyComponent;