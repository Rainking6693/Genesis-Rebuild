import React, { useEffect, useState } from 'react';
import { A/BTest } from 'sustainablestory-ab-testing'; // Assuming you have an A/B testing library

interface Props {
  message: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases
  accessibilityLabel?: string; // Add accessibilityLabel for accessibility
}

const MyComponent: React.FC<Props> = ({ message, testId, fallbackMessage = '', accessibilityLabel }) => {
  const [abTestResult, setAbTestResult] = useState<string | null>(null);

  useEffect(() => {
    const handleAbTestResult = (result: string) => {
      setAbTestResult(result);
    };

    const handleAbTestError = (error: Error) => {
      console.error(error);
      setAbTestResult(fallbackMessage);
    };

    A/BTest.start(testId, handleAbTestResult, handleAbTestError);
  }, [testId]);

  if (abTestResult === null) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div data-testid={`ab-test-result-${testId}`} aria-label={accessibilityLabel}>
      {abTestResult === message ? message : fallbackMessage}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { A/BTest } from 'sustainablestory-ab-testing'; // Assuming you have an A/B testing library

interface Props {
  message: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases
  accessibilityLabel?: string; // Add accessibilityLabel for accessibility
}

const MyComponent: React.FC<Props> = ({ message, testId, fallbackMessage = '', accessibilityLabel }) => {
  const [abTestResult, setAbTestResult] = useState<string | null>(null);

  useEffect(() => {
    const handleAbTestResult = (result: string) => {
      setAbTestResult(result);
    };

    const handleAbTestError = (error: Error) => {
      console.error(error);
      setAbTestResult(fallbackMessage);
    };

    A/BTest.start(testId, handleAbTestResult, handleAbTestError);
  }, [testId]);

  if (abTestResult === null) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div data-testid={`ab-test-result-${testId}`} aria-label={accessibilityLabel}>
      {abTestResult === message ? message : fallbackMessage}
    </div>
  );
};

export default MyComponent;