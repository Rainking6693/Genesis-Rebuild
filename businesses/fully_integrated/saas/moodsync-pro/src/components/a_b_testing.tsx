import React, { useState, useCallback, useEffect } from 'react';
import { ABTestResult, A/BTest } from '../../ab_testing';

type Props = {
  message: string;
  controlMessage?: string;
  fallbackMessage?: string;
};

type ABTestResultWithError = ABTestResult & { error: boolean };

const MyComponent: React.FC<Props> = ({ message, controlMessage = '', fallbackMessage = 'An error occurred' }) => {
  const [result, setResult] = useState<ABTestResultWithError | null>(null);

  const handleResult = useCallback((result: ABTestResult) => {
    setResult({ ...result, error: false });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    if (A/BTest && typeof A/BTest === 'function') {
      A/BTest(message, controlMessage, handleResult);

      timeoutId = setTimeout(() => {
        if (isMounted) {
          setResult({ ...result, error: true });
        }
      }, 10000); // 10 seconds timeout
    }

    // Clean up on component unmount
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message, controlMessage, handleResult]);

  if (result === null) {
    return <div aria-label="Loading" role="status">Loading...</div>;
  }

  if (result.error) {
    return <div aria-label="Error" role="alert">{fallbackMessage}</div>;
  }

  return <div aria-label="Experiment Result" role="status">{result.variation === 'A' ? result.messageA : result.messageB}</div>;
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { useState, useCallback, useEffect } from 'react';
import { ABTestResult, A/BTest } from '../../ab_testing';

type Props = {
  message: string;
  controlMessage?: string;
  fallbackMessage?: string;
};

type ABTestResultWithError = ABTestResult & { error: boolean };

const MyComponent: React.FC<Props> = ({ message, controlMessage = '', fallbackMessage = 'An error occurred' }) => {
  const [result, setResult] = useState<ABTestResultWithError | null>(null);

  const handleResult = useCallback((result: ABTestResult) => {
    setResult({ ...result, error: false });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    if (A/BTest && typeof A/BTest === 'function') {
      A/BTest(message, controlMessage, handleResult);

      timeoutId = setTimeout(() => {
        if (isMounted) {
          setResult({ ...result, error: true });
        }
      }, 10000); // 10 seconds timeout
    }

    // Clean up on component unmount
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message, controlMessage, handleResult]);

  if (result === null) {
    return <div aria-label="Loading" role="status">Loading...</div>;
  }

  if (result.error) {
    return <div aria-label="Error" role="alert">{fallbackMessage}</div>;
  }

  return <div aria-label="Experiment Result" role="status">{result.variation === 'A' ? result.messageA : result.messageB}</div>;
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;