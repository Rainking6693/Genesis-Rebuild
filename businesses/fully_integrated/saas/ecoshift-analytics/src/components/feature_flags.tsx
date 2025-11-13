import React from 'react';
import { useFeatureFlag, useFeatureFlagFallback } from '@ecoshift/feature-flags';

type FallbackMessageType = string | null;

interface Props {
  enabledMessage: string;
  disabledMessage: string;
  fallbackMessage?: FallbackMessageType;
}

const MyComponent: React.FC<Props> = ({ enabledMessage, disabledMessage, fallbackMessage }) => {
  const isFeatureEnabled = useFeatureFlag('sustainability-impact-dashboard');
  const fallback: FallbackMessageType = useFeatureFlagFallback('sustainability-impact-dashboard', fallbackMessage || 'Feature not available');

  if (typeof fallback !== 'string') {
    return <div>Error: Invalid fallback message</div>;
  }

  return (
    <div>
      {isFeatureEnabled ? enabledMessage : fallback}
    </div>
  );
};

export default MyComponent;

This updated version handles edge cases better, improves resiliency, and provides a more accessible and maintainable component.