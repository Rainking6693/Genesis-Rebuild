import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface FeatureFlagMessageProps {
  isEnabled: boolean;
  message: string | ReactNode;
  fallbackMessage?: string;
  ariaHidden?: boolean;
  dataTestid?: string;
}

// Add a unique name for the component for better identification and testing
const FeatureFlagMessage: React.FC<FeatureFlagMessageProps> = ({
  isEnabled,
  message,
  fallbackMessage = 'Feature flag is disabled',
  ariaHidden = !isEnabled,
  dataTestid = 'feature-flag-message',
  ...rest
}) => {
  if (!message) {
    return null;
  }

  return (
    <div data-testid={dataTestid} {...rest} aria-hidden={ariaHidden}>
      {isEnabled ? message : fallbackMessage}
    </div>
  );
};

// Export the component with a default export and a named export for better flexibility
export default FeatureFlagMessage;
export { FeatureFlagMessage };

In this version, I've added a `fallbackMessage` prop to provide a default message when the feature flag is disabled. I've also made the `ariaHidden` prop optional and given it a default value based on the `isEnabled` prop. This allows the component to be more flexible and easier to use. Additionally, I've added type safety by defining the `FeatureFlagMessageProps` interface.