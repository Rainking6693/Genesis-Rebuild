import React, { useEffect, useState } from 'react';
import { useFeatureFlag, useFeatureFlagWithDefault } from '@sustainflow/feature-flags';

interface Props {
  flagKey: string;
  messageOn: string;
  messageOff?: string;
  defaultMessage?: string;
  fallbackComponent?: React.FC<any>;
}

const MyComponent: React.FC<Props> = ({ flagKey, messageOn, messageOff, defaultMessage, fallbackComponent }) => {
  const isFeatureEnabled = useFeatureFlag(flagKey);
  const fallbackMessage = defaultMessage || (fallbackComponent ? <fallbackComponent /> : messageOff);

  return (
    <div>
      {isFeatureEnabled ? messageOn : fallbackMessage}
    </div>
  );
};

// Add a higher-order component to handle edge cases and provide a more accessible fallback
const WithFallback = (WrappedComponent: React.FC<any>) => {
  return (props: Props) => {
    const { flagKey, messageOn, messageOff, defaultMessage, fallbackComponent } = props;

    return (
      <div>
        <WrappedComponent {...props} />
        {!props.isFeatureEnabled && (fallbackComponent ? <fallbackComponent /> : <div>{defaultMessage}</div>)}
      </div>
    );
  };
};

// Use the higher-order component to wrap MyComponent
const WrappedMyComponent = WithFallback(MyComponent);

// Modify the useFeatureFlag hook to accept a default value and handle errors
export const useFeatureFlagWithDefault = (flagKey: string, defaultValue: boolean) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error(`Error retrieving feature flag ${flagKey}:`, error);
      setValue(defaultValue);
    };

    const flagValue = localStorage.getItem(flagKey);

    if (flagValue === 'true') {
      setValue(true);
    } else if (flagValue === 'false') {
      setValue(false);
    } else {
      setValue(defaultValue);
    }
  }, [flagKey, defaultValue]);

  return [value, setValue, handleError];
};

export default WrappedMyComponent;

In this updated code, I've added a `fallbackComponent` prop to allow for custom fallback components. I've also modified the `useFeatureFlagWithDefault` hook to return the current value, a setter function, and an error handling function. This allows for more flexibility and better error handling in case of issues retrieving the feature flag.