import React, { useState, useEffect } from 'react';
import { useA_BTesting } from '@climatecommit/feature-flags';

type Props = {
  message: string;
  fallbackMessage?: string;
  testId?: string;
  fallbackMessageFallback?: string; // Edge case: fallbackMessage is undefined
};

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Join our sustainability challenge!', testId, fallbackMessageFallback = 'An error occurred while fetching the feature flag. Please try again later.' }) => {
  const [isControlVersion, error] = useA_BTesting('my-component-version', { fallback: fallbackMessage });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!error) {
      setLoading(false);
    }
  }, [error]);

  if (error) {
    console.error('Error while fetching feature flag:', error);
    return <div role="alert">{fallbackMessageFallback}</div>;
  }

  return (
    <div data-testid={testId}>
      {loading ? <div>Loading...</div> : (
        <>
          {isControlVersion ? message : fallbackMessage}
          {/* Add ARIA-live region for accessibility */}
          <div aria-live="polite">{loading ? 'Loading...' : ''}</div>
        </>
      )}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { useA_BTesting } from '@climatecommit/feature-flags';

type Props = {
  message: string;
  fallbackMessage?: string;
  testId?: string;
  fallbackMessageFallback?: string; // Edge case: fallbackMessage is undefined
};

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Join our sustainability challenge!', testId, fallbackMessageFallback = 'An error occurred while fetching the feature flag. Please try again later.' }) => {
  const [isControlVersion, error] = useA_BTesting('my-component-version', { fallback: fallbackMessage });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!error) {
      setLoading(false);
    }
  }, [error]);

  if (error) {
    console.error('Error while fetching feature flag:', error);
    return <div role="alert">{fallbackMessageFallback}</div>;
  }

  return (
    <div data-testid={testId}>
      {loading ? <div>Loading...</div> : (
        <>
          {isControlVersion ? message : fallbackMessage}
          {/* Add ARIA-live region for accessibility */}
          <div aria-live="polite">{loading ? 'Loading...' : ''}</div>
        </>
      )}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;