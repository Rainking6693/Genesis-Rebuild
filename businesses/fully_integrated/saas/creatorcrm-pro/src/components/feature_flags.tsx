import React, { ReactNode, useCallback } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@genesis/feature-flags';

type Props = {
  enabledFeatureFlag: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  onError?: (error: FeatureFlagError) => void;
};

const MyComponent: React.FC<Props> = ({
  enabledFeatureFlag,
  message,
  fallbackMessage = 'Feature is currently disabled',
  onError,
}) => {
  const handleError = useCallback((error: FeatureFlagError) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  const isFeatureEnabled = useFeatureFlag(enabledFeatureFlag, { onError: handleError });

  if (!isFeatureEnabled) {
    return <div>{fallbackMessage}</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;

In this version, I've added a `handleError` callback function to manage errors that occur when trying to fetch the feature flag status. This function is passed to the `useFeatureFlag` hook as an optional `onError` parameter. Additionally, I've used the `useCallback` hook to ensure that the `handleError` function doesn't create a new function on every render, which can help with performance in some cases.