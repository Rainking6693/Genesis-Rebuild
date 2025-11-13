import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@genesis/feature-flags';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  fallbackMessage?: string;
  ariaLabel?: string;
  featureFlagName: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Content not available', ariaLabel = 'Climate Pitch Content', featureFlagName, ...rest }) => {
  const showMessage = useFeatureFlag(featureFlagName);

  if (showMessage === FeatureFlagStatus.ENABLED) {
    return (
      <div {...rest} aria-label={ariaLabel}>
        {message}
      </div>
    );
  }

  return (
    <div {...rest} aria-label={ariaLabel}>
      {fallbackMessage}
    </div>
  );
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useFeatureFlag, FeatureFlagStatus } from '@genesis/feature-flags';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  fallbackMessage?: string;
  ariaLabel?: string;
  featureFlagName: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Content not available', ariaLabel = 'Climate Pitch Content', featureFlagName, ...rest }) => {
  const showMessage = useFeatureFlag(featureFlagName);

  if (showMessage === FeatureFlagStatus.ENABLED) {
    return (
      <div {...rest} aria-label={ariaLabel}>
        {message}
      </div>
    );
  }

  return (
    <div {...rest} aria-label={ariaLabel}>
      {fallbackMessage}
    </div>
  );
};

export default MyComponent;