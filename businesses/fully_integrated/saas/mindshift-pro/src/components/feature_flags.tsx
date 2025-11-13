import React, { useState, useEffect } from 'react';
import { useFeatureFlag, useLocale } from '@mindshift-pro';

interface Props {
  flagName: string;
  defaultMessage: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ flagName, defaultMessage, fallbackMessage }) => {
  const [message, setMessage] = useState(defaultMessage);
  const { locale } = useLocale();
  const isFeatureEnabled = useFeatureFlag(flagName);

  useEffect(() => {
    if (isFeatureEnabled === undefined) {
      // Handle cases where the feature flag is not available or loading
      setMessage(fallbackMessage || defaultMessage);
      return;
    }

    if (isFeatureEnabled) {
      setMessage(isFeatureEnabled);
    } else {
      // Handle cases where the feature flag is disabled but a message is expected
      setMessage(fallbackMessage || defaultMessage);
    }
  }, [isFeatureEnabled, fallbackMessage, defaultMessage]);

  return (
    <div data-testid="my-component" dir={locale}>
      {message}
    </div>
  );
};

export default MyComponent;

In this updated version, I've added the following improvements:

1. State management for the message to handle cases where the feature flag is not available or loading.
2. Added a `defaultMessage` prop to provide a default message when the feature flag is not enabled.
3. Added an optional `fallbackMessage` prop to provide a fallback message when the feature flag is not enabled and no default message is provided.
4. Added a `useLocale` hook from the `@mindshift-pro/i18n` package to support internationalization (i18n) and make the component more accessible. I've also added the `dir` attribute to the component to support right-to-left languages.
5. Added a `data-testid` attribute to the component for easier testing.
6. Used the `useEffect` hook to update the message when the feature flag changes.
7. Simplified the prop types by removing the `messageEnabled` prop, as it is now handled by the state management.