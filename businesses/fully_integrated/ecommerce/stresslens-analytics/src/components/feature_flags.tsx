import React, { useContext, ReactNode } from 'react';
import { FeatureFlagContext } from './FeatureFlagContext';

interface Props {
  featureFlagName: string;
  fallback?: ReactNode;
}

const FeatureFlagsComponent: React.FC<Props> = ({ featureFlagName, fallback = null }) => {
  const { isEnabled: isFeatureEnabled, isLoading: isFeatureLoading } = useContext(FeatureFlagContext);
  const isFeatureActive = isFeatureEnabled && !isFeatureLoading;

  if (!isFeatureActive) {
    return <>{fallback || null}</>;
  }

  return (
    <div>
      {/* Your feature component goes here */}
      {/* If fallback is provided, add an aria-hidden attribute to hide it when the feature is enabled */}
      {fallback && !isFeatureActive && <div style={{ display: 'none' }} aria-hidden={true}>{fallback}</div>}
    </div>
  );
};

export default FeatureFlagsComponent;

import React, { useContext, ReactNode } from 'react';
import { FeatureFlagContext } from './FeatureFlagContext';

interface Props {
  featureFlagName: string;
  fallback?: ReactNode;
}

const FeatureFlagsComponent: React.FC<Props> = ({ featureFlagName, fallback = null }) => {
  const { isEnabled: isFeatureEnabled, isLoading: isFeatureLoading } = useContext(FeatureFlagContext);
  const isFeatureActive = isFeatureEnabled && !isFeatureLoading;

  if (!isFeatureActive) {
    return <>{fallback || null}</>;
  }

  return (
    <div>
      {/* Your feature component goes here */}
      {/* If fallback is provided, add an aria-hidden attribute to hide it when the feature is enabled */}
      {fallback && !isFeatureActive && <div style={{ display: 'none' }} aria-hidden={true}>{fallback}</div>}
    </div>
  );
};

export default FeatureFlagsComponent;