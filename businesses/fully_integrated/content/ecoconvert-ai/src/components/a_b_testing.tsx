import React, { useState, useEffect } from 'react';
import { ABTestProvider, useABTest } from '@ecoconvertai/testing'; // Import A/B testing library from EcoConvert AI's testing module

interface Props {
  messageA: string;
  messageB: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases where the A/B test fails or is not available
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, testId, fallbackMessage = '' }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const abTest = useABTest(testId);

  const handleResult = (result: any) => {
    setVariant(result.variant);
  };

  useEffect(() => {
    if (abTest) {
      abTest.on('result', handleResult);
      return () => abTest.off('result', handleResult);
    }
  }, [abTest]);

  if (!abTest) {
    return <div>Loading A/B test...</div>;
  }

  if (variant === null) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <ABTestProvider>
      <div data-testid={`my-component-${testId}`} role="presentation">
        {variant === 'A' ? messageA : messageB}
      </div>
    </ABTestProvider>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { ABTestProvider, useABTest } from '@ecoconvertai/testing'; // Import A/B testing library from EcoConvert AI's testing module

interface Props {
  messageA: string;
  messageB: string;
  testId: string; // Add testId for A/B testing
  fallbackMessage?: string; // Add fallbackMessage for edge cases where the A/B test fails or is not available
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, testId, fallbackMessage = '' }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const abTest = useABTest(testId);

  const handleResult = (result: any) => {
    setVariant(result.variant);
  };

  useEffect(() => {
    if (abTest) {
      abTest.on('result', handleResult);
      return () => abTest.off('result', handleResult);
    }
  }, [abTest]);

  if (!abTest) {
    return <div>Loading A/B test...</div>;
  }

  if (variant === null) {
    return <div>{fallbackMessage}</div>;
  }

  return (
    <ABTestProvider>
      <div data-testid={`my-component-${testId}`} role="presentation">
        {variant === 'A' ? messageA : messageB}
      </div>
    </ABTestProvider>
  );
};

export default MyComponent;