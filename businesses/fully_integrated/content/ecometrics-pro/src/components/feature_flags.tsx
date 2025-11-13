import React from 'react';
import { useFeatureFlag, useFeatureFlagFallback } from '@genesis/feature-flags';

interface Props {
  flagKey: string;
  messageOn: string;
  messageOff: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ flagKey, messageOn, messageOff, fallbackMessage, fallbackComponent }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey);
  const fallbackContent = useFeatureFlagFallback(flagKey, { message: fallbackMessage, component: fallbackComponent });

  return (
    <div>
      {isFeatureEnabled ? messageOn : fallbackContent.message}
      {!isFeatureEnabled && fallbackMessage && (
        <div role="alert" id="fallback-message">
          {fallbackContent.message}
        </div>
      )}
      {fallbackContent.component}
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { useFeatureFlag, useFeatureFlagFallback } from '@genesis/feature-flags';

interface Props {
  flagKey: string;
  messageOn: string;
  messageOff: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ flagKey, messageOn, messageOff, fallbackMessage, fallbackComponent }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey);
  const fallbackContent = useFeatureFlagFallback(flagKey, { message: fallbackMessage, component: fallbackComponent });

  return (
    <div>
      {isFeatureEnabled ? messageOn : fallbackContent.message}
      {!isFeatureEnabled && fallbackMessage && (
        <div role="alert" id="fallback-message">
          {fallbackContent.message}
        </div>
      )}
      {fallbackContent.component}
    </div>
  );
};

export default MyComponent;