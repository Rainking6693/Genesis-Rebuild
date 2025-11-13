import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface FeatureFlagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  featureName: string; // Add feature name for better understanding
  isFeatureEnabled: boolean; // Add flag for feature toggling
  message: string;
  fallbackMessage?: string; // Add optional fallback message for edge cases
  children?: ReactNode; // Add support for rendering additional content
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({
  featureName,
  isFeatureEnabled,
  message,
  fallbackMessage = `Feature ${featureName} is currently disabled.`,
  children,
  ...props
}) => {
  const rootProps: HTMLAttributes<HTMLDivElement> = { ...props };

  if (!isFeatureEnabled) {
    rootProps.role = 'alert';
    rootProps.aria-live = 'polite'; // Announce the fallback message to screen readers
    return <div {...rootProps}>{fallbackMessage}</div>;
  }

  return (
    <div {...rootProps}>
      {children}
      <div>{message}</div>
    </div>
  );
};

export default FeatureFlag;

In this updated version, I've made the following changes:

1. Extended the `Props` interface to include HTML attributes for better maintainability.
2. Added a `role` and `aria-live` attribute to the fallback message container to improve accessibility. The `role` attribute indicates that the content is an alert, and the `aria-live` attribute ensures that the fallback message is announced to screen readers.
3. Extracted the root props and spread them onto the root div to maintain consistency and make it easier to add additional props in the future.
4. Added type annotations for the `ReactNode` and `HTMLAttributes` types for better type safety.