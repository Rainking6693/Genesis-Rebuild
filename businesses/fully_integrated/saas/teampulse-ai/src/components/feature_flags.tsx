import React, { useState, useEffect } from 'react';
import { useFeatureFlags, UseFeatureFlagsReturnType } from '@team-pulse-ai/feature-flags';
import { useLocale, LocaleMessage } from './locale';

interface Props {
  featureFlagKey: string;
  enabledMessageKey: string;
  disabledMessageKey: string;
  fallbackMessage?: string;
}

const FunctionalComponent: React.FC<Props> = ({ featureFlagKey, enabledMessageKey, disabledMessageKey, fallbackMessage }) => {
  const { isFeatureEnabled }: UseFeatureFlagsReturnType = useFeatureFlags(featureFlagKey);
  const { getMessage } = useLocale();

  const [message, setMessage] = useState(fallbackMessage || getMessage(disabledMessageKey));

  useEffect(() => {
    if (isFeatureEnabled) {
      setMessage(getMessage(enabledMessageKey));
    } else {
      setMessage(getMessage(disabledMessageKey));
    }
  }, [isFeatureEnabled, enabledMessageKey, disabledMessageKey]);

  return <div>{message}</div>;
};

export default FunctionalComponent;

In this updated version, I've made the following improvements:

1. Renamed the props to be more descriptive and consistent.
2. Added a `fallbackMessage` prop to allow passing a custom fallback message when the feature is disabled.
3. Moved the conditional rendering logic into a `useEffect` hook, making the component more resilient by ensuring that the message is always up-to-date.
4. Improved the overall structure by reducing duplicated code.
5. Used TypeScript to type the `useFeatureFlags` return value for better type safety.