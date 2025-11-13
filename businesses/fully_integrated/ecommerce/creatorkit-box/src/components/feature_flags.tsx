import React, { ReactNode } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from 'feature-flags-library';

interface Props {
  flagName: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Default message', accessibilityLabel }) => {
  const isFeatureEnabled = useFeatureFlag(flagName) === FeatureFlagStatus.ENABLED;

  return (
    <div
      role="presentation"
      aria-hidden={!isFeatureEnabled}
      aria-label={isFeatureEnabled ? accessibilityLabel : undefined}
    >
      {isFeatureEnabled ? message : fallbackMessage}
    </div>
  );
};

export default MyComponent;

Changes made:

1. Imported `ReactNode` to accept any valid React node as the message.
2. Added a `fallbackMessage` prop to provide a default message when the feature flag is disabled.
3. Added an `accessibilityLabel` prop to improve accessibility for screen readers.
4. Changed the `if` condition to check for the exact `FeatureFlagStatus.ENABLED` value to handle edge cases where the library might return different values.
5. Added `role="presentation"` to the div elements to prevent them from being read by screen readers, as they are only used for layout purposes.
6. Added `aria-hidden` to the div elements to hide them when the feature flag is disabled, and `aria-label` to provide a meaningful label for screen readers when the feature flag is enabled.
7. Moved the `aria-label` assignment inside the JSX to conditionally provide a label only when the feature flag is enabled.