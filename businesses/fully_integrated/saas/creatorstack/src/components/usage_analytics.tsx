import React, { FC, useMemo, useState, useEffect } from 'react';
import { UsageAnalyticsProps } from './UsageAnalyticsProps';

const UsageAnalyticsErrorFallback: React.FC = () => {
  return <div>An error occurred while rendering the UsageAnalytics component.</div>;
};

const UsageAnalytics: FC<UsageAnalyticsProps> = ({ message, onError }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const parser = new DOMParser();
    try {
      const doc = parser.parseFromString(message, 'text/html');
      if (!doc.body.textContent.trim()) {
        throw new Error('Empty or whitespace message provided.');
      }
    } catch (error) {
      onError?.(error);
      setHasError(true);
      console.error('UsageAnalytics component error:', error);
      return;
    }
  }, [message]);

  const jsx = useMemo(() => {
    if (hasError) {
      return <UsageAnalyticsErrorFallback />;
    }

    return <div dangerouslySetInnerHTML={{ __html: message }} />;
  }, [message, hasError]);

  return (
    <>
      {jsx}
      {hasError && <div>A JavaScript error occurred. Please refresh the page to try again.</div>}
    </>
  );
};

UsageAnalytics.errorComponent = UsageAnalyticsErrorFallback;

UsageAnalytics.defaultProps = {
  onError: console.error,
};

export default UsageAnalytics;

interface UsageAnalyticsProps {
  message: string;
  onError?: (error: Error) => void;
}

Changes made:

1. Added a `useEffect` hook to validate the provided message before rendering. If the message is empty or whitespace, an error is thrown and logged.
2. Added a `onError` prop to allow custom error handling. The default value is the console.error function.
3. Added accessibility by providing a meaningful error message for screen readers.
4. Made the component more maintainable by separating the error handling logic from the rendering logic.
5. Added TypeScript type for the `onError` prop.