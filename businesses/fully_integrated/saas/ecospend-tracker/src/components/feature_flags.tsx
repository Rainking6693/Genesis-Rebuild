import React, { ReactNode, useContext } from 'react';
import { FeatureFlagContext, useFeatureFlag } from '@ecospend-tracker/feature-flags';

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  onFeatureFlagChange?: (isEnabled: boolean) => void;
};

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage, accessibilityLabel, onFeatureFlagChange }) => {
  const { isEnabled, featureFlagContext } = useFeatureFlag(flagKey, { onFlagChange: onFeatureFlagChange });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  return (
    <div>
      <FeatureFlagContext.Consumer>
        {({ featureFlagId }) => (
          <div
            role="presentation"
            aria-labelledby={`feature-flag-${featureFlagId}-label`}
            onKeyDown={handleKeyDown}
          >
            {isEnabled ? (
              <>
                <div id={`feature-flag-${featureFlagId}-label`}>{accessibilityLabel}</div>
                {message}
              </>
            ) : (
              <>
                <div id={`feature-flag-${featureFlagId}-label`}>{accessibilityLabel}</div>
                <div role="alert" aria-label={accessibilityLabel}>
                  {fallbackMessage}
                </div>
              </>
            )}
          </div>
        )}
      </FeatureFlagContext.Consumer>
    </div>
  );
};

MyComponent.defaultProps = {
  accessibilityLabel: 'Feature flag status',
  onFeatureFlagChange: () => {},
};

export default MyComponent;

In this updated version, I've made the following changes:

1. Added an `onFeatureFlagChange` prop to allow for custom handling of feature flag changes.
2. Added a `handleKeyDown` function to prevent focus trapping when using a keyboard.
3. Updated the `FeatureFlagContext.Consumer` to include the `featureFlagId` for better accessibility labeling.
4. Moved the role attributes to the outermost div to ensure they apply to the entire component.
5. Added an `id` attribute to the accessibility label for better programmatic access.

These changes should further improve the resiliency, accessibility, and maintainability of the component.