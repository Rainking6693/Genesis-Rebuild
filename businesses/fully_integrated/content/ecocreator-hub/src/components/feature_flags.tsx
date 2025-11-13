import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@ecocreator-hub/feature-flags';

type FeatureFlagStatusWithUnknown = FeatureFlagStatus | 'unknown';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
}

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Feature is disabled', accessibilityLabel, testID, disabled, ...rest }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey);

  if (isFeatureEnabled === FeatureFlagStatusWithUnknown) {
    console.error(`Unknown status for feature flag "${flagKey}".`);
    return null;
  }

  if (!disabled && isFeatureEnabled === FeatureFlagStatus.DISABLED) {
    return <div data-testid={testID} role="alert" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
  }

  return <div data-testid={testID} role="presentation" aria-label={accessibilityLabel} {...rest}>{message}</div>;
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@ecocreator-hub/feature-flags';

type FeatureFlagStatusWithUnknown = FeatureFlagStatus | 'unknown';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
}

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Feature is disabled', accessibilityLabel, testID, disabled, ...rest }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey);

  if (isFeatureEnabled === FeatureFlagStatusWithUnknown) {
    console.error(`Unknown status for feature flag "${flagKey}".`);
    return null;
  }

  if (!disabled && isFeatureEnabled === FeatureFlagStatus.DISABLED) {
    return <div data-testid={testID} role="alert" aria-label={accessibilityLabel}>{fallbackMessage}</div>;
  }

  return <div data-testid={testID} role="presentation" aria-label={accessibilityLabel} {...rest}>{message}</div>;
};

export default MyComponent;