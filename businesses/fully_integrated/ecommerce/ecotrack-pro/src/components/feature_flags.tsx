import React, { ReactNode, useEffect, useState } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@ecotrack-pro/feature-flags';

interface Props {
  flagName: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testId?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Disabled', accessibilityLabel, testId }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<FeatureFlagStatus | null>(null);

  useEffect(() => {
    const handleFeatureFlag = (status: FeatureFlagStatus) => {
      setIsFeatureEnabled(status);
    };

    const unsubscribe = useFeatureFlag(flagName, handleFeatureFlag);

    return () => {
      unsubscribe();
    };
  }, [flagName]);

  if (isFeatureEnabled === FeatureFlagStatus.LOADING) {
    return <div data-testid={testId}>Loading...</div>;
  }

  if (isFeatureEnabled === FeatureFlagStatus.ENABLED) {
    return <div role="presentation" aria-label={accessibilityLabel} data-testid={testId}>{message}</div>;
  }

  if (isFeatureEnabled === FeatureFlagStatus.DISABLED) {
    return <div role="alert" aria-label={accessibilityLabel} data-testid={testId}>{fallbackMessage}</div>;
  }

  return null;
};

export default MyComponent;

import React, { ReactNode, useEffect, useState } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@ecotrack-pro/feature-flags';

interface Props {
  flagName: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testId?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Disabled', accessibilityLabel, testId }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<FeatureFlagStatus | null>(null);

  useEffect(() => {
    const handleFeatureFlag = (status: FeatureFlagStatus) => {
      setIsFeatureEnabled(status);
    };

    const unsubscribe = useFeatureFlag(flagName, handleFeatureFlag);

    return () => {
      unsubscribe();
    };
  }, [flagName]);

  if (isFeatureEnabled === FeatureFlagStatus.LOADING) {
    return <div data-testid={testId}>Loading...</div>;
  }

  if (isFeatureEnabled === FeatureFlagStatus.ENABLED) {
    return <div role="presentation" aria-label={accessibilityLabel} data-testid={testId}>{message}</div>;
  }

  if (isFeatureEnabled === FeatureFlagStatus.DISABLED) {
    return <div role="alert" aria-label={accessibilityLabel} data-testid={testId}>{fallbackMessage}</div>;
  }

  return null;
};

export default MyComponent;