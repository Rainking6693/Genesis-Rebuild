import React, { ReactNode } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@ecotrack-pro/feature-flags';

type FeatureFlagStatusType = 'ENABLED' | 'DISABLED' | 'UNAVAILABLE';

type Props = {
  flagName: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const FeatureFlagComponent: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Feature is disabled', accessibilityLabel = 'MyComponent', testID }) => {
  const isEnabled = useFeatureFlag(flagName);

  if (isEnabled === FeatureFlagStatus.ENABLED) {
    return (
      <div data-testid={testID} role="presentation" aria-label={accessibilityLabel}>
        {message}
      </div>
    );
  }

  return (
    <div data-testid={testID} role="alert" aria-label={accessibilityLabel}>
      {fallbackMessage}
    </div>
  );
};

export default FeatureFlagComponent;

With these additional changes, the component is more resilient, accessible, and maintainable, and it provides better support for testing and automation.