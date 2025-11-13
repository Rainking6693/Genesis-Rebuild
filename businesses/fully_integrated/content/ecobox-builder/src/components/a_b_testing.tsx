import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '@ecobox-builder/ab-testing';

interface Props {
  message: string;
  fallbackMessage?: string; // Add fallback message for edge cases
  testVariant?: string; // Allow custom test variant for testing purposes
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message', testVariant }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { updateVariant } = useA/BTesting('SubscriptionBoxCuration', {
    fallback: fallbackMessage, // Set fallback message for useA/BTesting
  });

  useEffect(() => {
    const loadVariant = async () => {
      try {
        setIsLoading(true);
        const loadedVariant = await updateVariant(testVariant);
        setVariant(loadedVariant);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (!variant) {
      loadVariant();
    }
  }, [testVariant, updateVariant]);

  if (error) {
    console.error('Error while loading A/B testing variant:', error);
    return <div>{fallbackMessage}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{variant === 'control' ? fallbackMessage : message}</div>;
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '@ecobox-builder/ab-testing';

interface Props {
  message: string;
  fallbackMessage?: string; // Add fallback message for edge cases
  testVariant?: string; // Allow custom test variant for testing purposes
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message', testVariant }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { updateVariant } = useA/BTesting('SubscriptionBoxCuration', {
    fallback: fallbackMessage, // Set fallback message for useA/BTesting
  });

  useEffect(() => {
    const loadVariant = async () => {
      try {
        setIsLoading(true);
        const loadedVariant = await updateVariant(testVariant);
        setVariant(loadedVariant);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (!variant) {
      loadVariant();
    }
  }, [testVariant, updateVariant]);

  if (error) {
    console.error('Error while loading A/B testing variant:', error);
    return <div>{fallbackMessage}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{variant === 'control' ? fallbackMessage : message}</div>;
};

export default MyComponent;