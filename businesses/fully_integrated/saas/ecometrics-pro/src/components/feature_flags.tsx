import React, { useState, useEffect, useMemo } from 'react';
import { useFeatureFlag, useLocale } from '@ecometrics-pro/feature-flags';

interface Props {
  flagKey: string;
  messageOn: string;
  messageOff?: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ flagKey, messageOn, messageOff = 'Feature disabled', fallbackMessage = 'Feature not found' }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const { locale } = useLocale();

  useEffect(() => {
    const handleFeatureFlagChange = (isEnabled: boolean) => {
      setIsFeatureEnabled(isEnabled);
    };

    const handleFeatureFlagError = () => {
      setIsFeatureEnabled(false);
    };

    useFeatureFlag(flagKey, handleFeatureFlagChange, handleFeatureFlagError);
  }, [flagKey]);

  const enabledMessage = isFeatureEnabled ? messageOn : fallbackMessage;
  const localizedMessage = useMemo(() => {
    if (locale) {
      const localizedOn = locale.messages[messageOn];
      const localizedOff = locale.messages[fallbackMessage] || locale.messages['feature_disabled'];
      return { enabledMessage: localizedOn, disabledMessage: localizedOff };
    }
    return { enabledMessage, disabledMessage: fallbackMessage };
  }, [locale, messageOn, fallbackMessage]);

  return <div>{localizedMessage.enabledMessage}</div>;
};

export default MyComponent;

In this updated version, I've added the following improvements:

1. Added a `fallbackMessage` prop to provide a custom message when the feature flag is not found.
2. Added `handleFeatureFlagError` function to handle errors that may occur when trying to access the feature flag. This function sets the `isFeatureEnabled` state to false.
3. Updated the `useEffect` hook to include both `handleFeatureFlagChange` and `handleFeatureFlagError` functions as arguments. This ensures that the component is updated correctly when the feature flag changes or an error occurs.
4. Updated the `localizedMessage` calculation to use the `fallbackMessage` when the `locale` is not available.

These changes make the component more resilient by handling errors gracefully, and more flexible by allowing for custom error messages. The component is also more maintainable due to the use of additional props and the separation of error handling from the feature flag subscription.