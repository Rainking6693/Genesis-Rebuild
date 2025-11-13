import React, { useEffect, useState } from 'react';
import { A/BTest } from '@TeamPulseAI/ab-testing';

interface Props {
  message: string;
  experimentName: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, experimentName, fallbackMessage = message }) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the component is mounted before running the A/B test
    if (document.readyState === 'complete') {
      runABTest();
    } else {
      document.addEventListener('DOMContentLoaded', runABTest);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('DOMContentLoaded', runABTest);
    };
  }, []);

  const runABTest = () => {
    // Run the A/B test and update the component with the result
    A/BTest(experimentName, (result) => {
      if (result) {
        // Update the component with the result from the A/B test
        setResult(result);
      } else {
        // Use the fallback message if the A/B test fails or is not available
        setResult(fallbackMessage);
      }
    });
  };

  return (
    <div id="my-component">
      {/* Add aria-label for accessibility */}
      <div aria-label="My component message">
        {result !== null ? result : message}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { A/BTest } from '@TeamPulseAI/ab-testing';

interface Props {
  message: string;
  experimentName: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, experimentName, fallbackMessage = message }) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the component is mounted before running the A/B test
    if (document.readyState === 'complete') {
      runABTest();
    } else {
      document.addEventListener('DOMContentLoaded', runABTest);
    }

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('DOMContentLoaded', runABTest);
    };
  }, []);

  const runABTest = () => {
    // Run the A/B test and update the component with the result
    A/BTest(experimentName, (result) => {
      if (result) {
        // Update the component with the result from the A/B test
        setResult(result);
      } else {
        // Use the fallback message if the A/B test fails or is not available
        setResult(fallbackMessage);
      }
    });
  };

  return (
    <div id="my-component">
      {/* Add aria-label for accessibility */}
      <div aria-label="My component message">
        {result !== null ? result : message}
      </div>
    </div>
  );
};

export default MyComponent;