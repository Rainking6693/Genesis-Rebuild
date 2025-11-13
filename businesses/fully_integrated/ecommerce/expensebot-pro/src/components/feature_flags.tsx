import React, { ReactNode, ReactElement } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@expensebot-pro/feature-flags';

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  defaultFlagStatus?: FeatureFlagStatus;
};

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Feature is disabled', accessibilityLabel, defaultFlagStatus = FeatureFlagStatus.UNDEFINED }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey, defaultFlagStatus);

  if (isFeatureEnabled === FeatureFlagStatus.UNDEFINED) {
    throw new Error(`Feature flag "${flagKey}" is not defined.`);
  }

  if (isFeatureEnabled === FeatureFlagStatus.ENABLED) {
    return <div role="presentation" aria-label={accessibilityLabel}>{message}</div>;
  }

  return <div role="alert" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
};

export default MyComponent;

import React, { ReactNode, ReactElement } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@expensebot-pro/feature-flags';

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  defaultFlagStatus?: FeatureFlagStatus;
};

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Feature is disabled', accessibilityLabel, defaultFlagStatus = FeatureFlagStatus.UNDEFINED }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey, defaultFlagStatus);

  if (isFeatureEnabled === FeatureFlagStatus.UNDEFINED) {
    throw new Error(`Feature flag "${flagKey}" is not defined.`);
  }

  if (isFeatureEnabled === FeatureFlagStatus.ENABLED) {
    return <div role="presentation" aria-label={accessibilityLabel}>{message}</div>;
  }

  return <div role="alert" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
};

export default MyComponent;