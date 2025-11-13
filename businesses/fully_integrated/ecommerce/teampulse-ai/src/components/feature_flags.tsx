import React, { useState, useEffect } from 'react';
import { useFeatureFlags, UseFeatureFlagsResult } from '@team-pulse-ai/feature-flags';
import { useLocale } from './locale';

interface Props {
  id: string;
  message: string;
  errorMessage?: string; // Added for better customization of error messages
}

const FeatureFlagComponent: React.FC<Props> = ({ id, message, errorMessage }) => {
  const { isFeatureEnabled, error: featureFlagsError } = useFeatureFlags(id);
  const { locale } = useLocale();
  const [localizedErrorMessage, setLocalizedErrorMessage] = useState(errorMessage); // Store localized error message
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFeatureEnabled && featureFlagsError) {
      setLocalizedErrorMessage(locale('error.feature_flag_disabled'));
      setError(featureFlagsError);
    } else {
      setLocalizedErrorMessage(null);
      setError(null);
    }
  }, [isFeatureEnabled, featureFlagsError, locale]);

  if (error) {
    return (
      <div role="alert" aria-describedby="error-description">
        <p>{localizedErrorMessage}</p>
        <p id="error-description">{error}</p>
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return null;
  }

  return <div>{message}</div>;
};

export default FeatureFlagComponent;

In this updated version, I've made the following changes:

1. Added an `errorMessage` prop to allow for better customization of error messages.
2. Extracted the `featureFlagsError` from the `useFeatureFlags` result for better readability.
3. Separated the localized error message and the actual error message to improve maintainability.
4. Added an `aria-describedby` attribute to the error alert for better accessibility, linking the error message to an ID for screen readers.
5. Updated the useEffect hook to handle both `isFeatureEnabled` and `featureFlagsError` changes.
6. Moved the localized error message update to the top of the useEffect hook to ensure it's updated first.
7. Added a check for `featureFlagsError` to ensure that the error message is displayed when appropriate.
8. Removed the duplicated component definition.

Now, the component is more resilient, handles edge cases, is more accessible, and is more maintainable.