import React, { useContext } from 'react';

type FeatureFlagContextType = {
  isFeatureEnabled: (feature: string) => boolean;
};

interface Props {
  message: string;
  fallbackMessage?: string;
  disabledMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message', disabledMessage = 'Feature is disabled' }) => {
  const { isFeatureEnabled } = useContext<FeatureFlagContextType>(FeatureFlagContext);

  // Check if the feature flag is enabled, or if the fallback message or disabled message should be used
  const shouldRender = isFeatureEnabled('return_iq_feature') || (!fallbackMessage && !message) || !message;

  if (!shouldRender) {
    return <div>{disabledMessage}</div>;
  }

  return <div>{message || fallbackMessage}</div>;
};

export default MyComponent;

import React, { useContext } from 'react';

type FeatureFlagContextType = {
  isFeatureEnabled: (feature: string) => boolean;
};

interface Props {
  message: string;
  fallbackMessage?: string;
  disabledMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message', disabledMessage = 'Feature is disabled' }) => {
  const { isFeatureEnabled } = useContext<FeatureFlagContextType>(FeatureFlagContext);

  // Check if the feature flag is enabled, or if the fallback message or disabled message should be used
  const shouldRender = isFeatureEnabled('return_iq_feature') || (!fallbackMessage && !message) || !message;

  if (!shouldRender) {
    return <div>{disabledMessage}</div>;
  }

  return <div>{message || fallbackMessage}</div>;
};

export default MyComponent;