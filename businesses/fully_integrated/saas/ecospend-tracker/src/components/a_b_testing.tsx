import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../hooks/useA_B_Testing';

interface Props {
  messageA: string;
  messageB: string;
}

const useABTesting = (experimentName: string, maxRetries = 5, retryInterval = 5000) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    const fetchVariant = async () => {
      if (retries >= maxRetries) {
        console.error(`Max retries reached for experiment ${experimentName}. Falling back to default.`);
        setVariant('Fallback');
        return;
      }

      try {
        const response = await fetch(`/api/a-b-testing/${experimentName}`);
        const data = await response.json();
        setVariant(data.variant);
      } catch (error) {
        console.error(`Error fetching variant for experiment ${experimentName}:`, error);
        setRetries(retries + 1);
        setTimeout(fetchVariant, retryInterval);
      }
    };

    fetchVariant();
  }, [experimentName, retries]);

  return [variant, retries];
};

const MyComponent: React.FC<Props> = ({ messageA, messageB }) => {
  const [variant, retries] = useABTesting('EcoSpendTracker_ExpenseTracking_Message');

  if (retries > 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {variant === 'Fallback' ? (
        <div role="alert" aria-live="polite">
          We're having trouble determining the variant for this experiment. Please refresh the page and try again.
        </div>
      ) : (
        <div role="alert" aria-live="polite">
          {variant === 'A' ? messageA : messageB}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../hooks/useA_B_Testing';

interface Props {
  messageA: string;
  messageB: string;
}

const useABTesting = (experimentName: string, maxRetries = 5, retryInterval = 5000) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    const fetchVariant = async () => {
      if (retries >= maxRetries) {
        console.error(`Max retries reached for experiment ${experimentName}. Falling back to default.`);
        setVariant('Fallback');
        return;
      }

      try {
        const response = await fetch(`/api/a-b-testing/${experimentName}`);
        const data = await response.json();
        setVariant(data.variant);
      } catch (error) {
        console.error(`Error fetching variant for experiment ${experimentName}:`, error);
        setRetries(retries + 1);
        setTimeout(fetchVariant, retryInterval);
      }
    };

    fetchVariant();
  }, [experimentName, retries]);

  return [variant, retries];
};

const MyComponent: React.FC<Props> = ({ messageA, messageB }) => {
  const [variant, retries] = useABTesting('EcoSpendTracker_ExpenseTracking_Message');

  if (retries > 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {variant === 'Fallback' ? (
        <div role="alert" aria-live="polite">
          We're having trouble determining the variant for this experiment. Please refresh the page and try again.
        </div>
      ) : (
        <div role="alert" aria-live="polite">
          {variant === 'A' ? messageA : messageB}
        </div>
      )}
    </div>
  );
};

export default MyComponent;