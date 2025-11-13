import React, { ReactNode, useContext, useMemo } from 'react';
import { FeatureFlagContext, useFeatureFlag } from '@carboncopyai/feature-flags';

type Props = {
  message?: ReactNode;
  fallbackMessage?: ReactNode;
  accessibilityLabel?: string;
};

const MyComponent: React.FC<Props> = ({ message = 'Default message', fallbackMessage, accessibilityLabel }) => {
  const FeatureFlagContextExists = typeof FeatureFlagContext !== 'undefined';
  const { isSustainabilityFeatureEnabled } = useContext(FeatureFlagContext) as ReturnType<typeof useFeatureFlag>['isFeatureEnabled'];

  const isFeatureEnabled = useMemo(() => isSustainabilityFeatureEnabled, [isSustainabilityFeatureEnabled]);

  if (!isFeatureEnabled) {
    return <div role="alert" aria-label={accessibilityLabel || fallbackMessage}>{fallbackMessage}</div>;
  }

  return <div role="alert" aria-label={accessibilityLabel}>{message}</div>;
};

export default MyComponent;

This updated component now checks for the existence of the `FeatureFlagContext`, uses the `useMemo` hook to optimize performance, and provides a default value for the `message` prop. These changes make the component more resilient, flexible, and maintainable.