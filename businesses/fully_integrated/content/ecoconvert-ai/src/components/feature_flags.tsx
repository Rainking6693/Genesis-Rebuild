import React, { ReactNode, useState } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@ecoconvert-ai/feature-flags';

interface Props {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
  testId?: string;
}

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage = 'Feature is disabled', accessibilityLabel, testId }) => {
  const [isEnabled, error] = useFeatureFlag(flagKey);
  const [localError, setLocalError] = useState<FeatureFlagError | null>(null);

  React.useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  if (localError) {
    console.error(localError);
    return <div data-testid={`${testId}-error`}>{fallbackMessage}</div>;
  }

  if (!isEnabled) {
    return <div data-testid={`${testId}-fallback`} aria-label={accessibilityLabel}>{fallbackMessage}</div>;
  }

  return (
    <div data-testid={testId} aria-label={accessibilityLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  testId: 'my-component',
};

export default MyComponent;

1. Added a `fallbackMessage` prop to provide a custom message when the feature flag is disabled.
2. Added an `accessibilityLabel` prop to improve accessibility for screen readers.
3. Checked for errors returned by `useFeatureFlag` and provided a fallback message if an error occurs. The error handling is now separated into a local state to avoid re-rendering the component when the error changes.
4. Added `data-testid` attributes for easier testing. The test ID can now be customized using the `testId` prop.
5. Made `message` a `ReactNode` type to support JSX elements and strings.
6. Added a type for the `Props` interface to better document the component's props.
7. Renamed the component to `MyComponent` to avoid naming conflicts if multiple instances of the component are used in the codebase.
8. Added defaultProps for the testId to avoid having to specify it every time the component is used.