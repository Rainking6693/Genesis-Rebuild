import React, { ReactNode, useState, useEffect } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@ecoscore-analytics/feature-flags';

type FeatureFlagErrorType = {
  message: string;
};

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  fallbackComponent?: React.FC<any>;
  disabled?: boolean;
};

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage, fallbackComponent, disabled }) => {
  const { isEnabled, error, loading } = useFeatureFlagWithErrorHandling(flagKey);

  if (loading) {
    return <div data-testid="feature-flag-loading">Loading feature flag...</div>;
  }

  if (error) {
    return <div data-testid="feature-flag-error">{error.message}</div>;
  }

  if (disabled && !isEnabled) {
    return <div data-testid="feature-flag-disabled">Feature flag is disabled</div>;
  }

  if (isEnabled) {
    return <div data-testid="feature-flag-enabled">{message}</div>;
  }

  if (fallbackMessage) {
    return <div data-testid="feature-flag-fallback-message">{fallbackMessage}</div>;
  }

  if (fallbackComponent) {
    return <fallbackComponent />;
  }

  return null;
};

MyComponent.defaultProps = {
  fallbackMessage: 'Feature flag not found or disabled',
};

const useFeatureFlagWithErrorHandling = (flagKey: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<FeatureFlagError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFeatureFlag = async () => {
      try {
        const result = await useFeatureFlag(flagKey);
        setIsEnabled(result);
        setLoading(false);
      } catch (error) {
        setError(error as FeatureFlagErrorType);
        setLoading(false);
      }
    };

    handleFeatureFlag();
  }, [flagKey]);

  return { isEnabled, error, loading };
};

export { useFeatureFlagWithErrorHandling };
export { MyComponent };

import React, { ReactNode, useState, useEffect } from 'react';
import { useFeatureFlag, FeatureFlagError } from '@ecoscore-analytics/feature-flags';

type FeatureFlagErrorType = {
  message: string;
};

type Props = {
  flagKey: string;
  message: ReactNode;
  fallbackMessage?: ReactNode;
  fallbackComponent?: React.FC<any>;
  disabled?: boolean;
};

const MyComponent: React.FC<Props> = ({ flagKey, message, fallbackMessage, fallbackComponent, disabled }) => {
  const { isEnabled, error, loading } = useFeatureFlagWithErrorHandling(flagKey);

  if (loading) {
    return <div data-testid="feature-flag-loading">Loading feature flag...</div>;
  }

  if (error) {
    return <div data-testid="feature-flag-error">{error.message}</div>;
  }

  if (disabled && !isEnabled) {
    return <div data-testid="feature-flag-disabled">Feature flag is disabled</div>;
  }

  if (isEnabled) {
    return <div data-testid="feature-flag-enabled">{message}</div>;
  }

  if (fallbackMessage) {
    return <div data-testid="feature-flag-fallback-message">{fallbackMessage}</div>;
  }

  if (fallbackComponent) {
    return <fallbackComponent />;
  }

  return null;
};

MyComponent.defaultProps = {
  fallbackMessage: 'Feature flag not found or disabled',
};

const useFeatureFlagWithErrorHandling = (flagKey: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<FeatureFlagError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFeatureFlag = async () => {
      try {
        const result = await useFeatureFlag(flagKey);
        setIsEnabled(result);
        setLoading(false);
      } catch (error) {
        setError(error as FeatureFlagErrorType);
        setLoading(false);
      }
    };

    handleFeatureFlag();
  }, [flagKey]);

  return { isEnabled, error, loading };
};

export { useFeatureFlagWithErrorHandling };
export { MyComponent };