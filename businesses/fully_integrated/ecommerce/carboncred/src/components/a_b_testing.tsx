import React, { useEffect, useState } from 'react';
import { useA_BTesting } from '@carboncred/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...', fallbackComponent = <div>{fallbackMessage}</div> }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const result = await useA_BTesting('carbon-footprint-scoring');
        setVariant(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchVariant();
  }, []);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (variant === null) {
    return fallbackComponent;
  }

  return (
    <div aria-label="A/B testing result">
      {variant === 'A' ? messageA : messageB}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useA_BTesting } from '@carboncred/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...', fallbackComponent = <div>{fallbackMessage}</div> }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const result = await useA_BTesting('carbon-footprint-scoring');
        setVariant(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchVariant();
  }, []);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (variant === null) {
    return fallbackComponent;
  }

  return (
    <div aria-label="A/B testing result">
      {variant === 'A' ? messageA : messageB}
    </div>
  );
};

export default MyComponent;