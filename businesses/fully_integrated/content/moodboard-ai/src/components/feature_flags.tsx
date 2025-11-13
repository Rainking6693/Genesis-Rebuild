import React, { ReactNode, useCallback } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@moodboard-ai/feature-flags';

interface Props {
  flagName: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  onError?: (error: FeatureFlagError) => void;
  accessibilityLabel?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Feature flag not found or disabled', onError, accessibilityLabel }) => {
  const handleError = useCallback((error: FeatureFlagError) => {
    if (onError) onError(error);
  }, [onError]);

  const isEnabled = useFeatureFlag(flagName, handleError);

  if (isEnabled) {
    return (
      <div role="alert" aria-label={accessibilityLabel}>
        {message}
      </div>
    );
  }

  return (
    <div role="alert" aria-label={accessibilityLabel}>
      {fallbackMessage}
    </div>
  );
};

const MyComponentFallback: React.FC<Props> = ({ flagName, message, fallbackMessage = 'Feature flag not found or disabled', onError, accessibilityLabel }) => {
  const handleError = useCallback((error: FeatureFlagError) => {
    if (onError) onError(error);
  }, [onError]);

  return <MyComponent flagName={flagName} message={message} fallbackMessage={fallbackMessage} onError={handleError} accessibilityLabel={accessibilityLabel} />;
};

export default MyComponent;
export { MyComponentFallback };

Changes made:

1. Added an `accessibilityLabel` prop to provide a label for screen readers.
2. Extracted the error handling function into a separate `handleError` callback to avoid re-creating it on every render.
3. Updated the component to use the `role` and `aria-label` attributes for better accessibility.
4. Exported both components for better maintainability, with the default export being the primary MyComponent and the secondary export being the fallback version.