import React, { useContext } from 'react';
import { FeatureFlagContext } from '../../contexts/FeatureFlagContext';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Loading...' }) => {
  const { isFeatureEnabled } = useContext(FeatureFlagContext);

  if (!isFeatureEnabled('retentionBotAI')) {
    return <div>{fallbackMessage}</div>;
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  fallbackMessage: 'Loading...',
};

export default MyComponent;

import React, { useContext } from 'react';
import { FeatureFlagContext } from '../../contexts/FeatureFlagContext';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Loading...' }) => {
  const { isFeatureEnabled } = useContext(FeatureFlagContext);

  if (!isFeatureEnabled('retentionBotAI')) {
    return <div>{fallbackMessage}</div>;
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  fallbackMessage: 'Loading...',
};

export default MyComponent;