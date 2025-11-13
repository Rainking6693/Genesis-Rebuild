import React, { ReactNode, useState, useEffect } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@storybridge-ai/feature-flags';

type FeatureFlagErrorType = {
  message: string;
};

type ReactNodeType = React.ReactNode;

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage, fallbackComponent, loading, disabled, testId }) => {
  const { isEnabled, error } = useIsFeatureFlagEnabled(flagKey);

  if (disabled || (loading && !isEnabled) || error) {
    return <div data-testid={testId}>{error ? error.message : disabled ? 'Feature flag is disabled' : 'Loading...'}</div>;
  }

  return <div data-testid={testId}>{message}</div>;
};

MyComponent.defaultProps = {
  fallbackMessage: 'Feature flag not found or disabled',
  testId: 'my-component',
};

const useIsFeatureFlagEnabled = (flagKey: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<FeatureFlagErrorType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleFeatureFlag = async () => {
      try {
        const result = await useFeatureFlag(flagKey);
        setIsEnabled(result);
        setLoading(false);
      } catch (error) {
        setError({ message: error.message });
        setLoading(false);
      }
    };

    handleFeatureFlag();
  }, [flagKey]);

  return { isEnabled, error, loading };
};

export type UseFeatureFlagWithErrorHandlingType = () => { isEnabled: boolean | null, error: FeatureFlagErrorType | null, loading: boolean };

export const useFeatureFlagWithErrorHandling: UseFeatureFlagWithErrorHandlingType = useFeatureFlagWithErrorHandling;

export { MyComponent };

In this updated version, I've added a `loading` state to the `useFeatureFlagWithErrorHandling` custom hook to handle the asynchronous nature of the feature flag check. I've also added a `disabled` prop to the `MyComponent` to allow for explicit disabling of the component when the feature flag is not available or an error occurs.

I've also added a `useIsFeatureFlagEnabled` custom hook that returns a boolean indicating whether the feature flag is enabled, along with the error and loading state. This allows the component to handle errors gracefully and provide a more user-friendly experience.

Lastly, I've added a `testId` prop to the `MyComponent` for better accessibility testing.