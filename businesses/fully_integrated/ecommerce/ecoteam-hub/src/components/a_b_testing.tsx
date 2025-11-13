import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '@ecoteam-hub/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...' }) => {
  const [variant, setVariant] = useState(fallbackMessage);
  const [error, setError] = useState(null);

  const { isLoading, data } = useA/BTesting('sustainability-challenge-message', {
    onSuccess: (responseData) => {
      setVariant(responseData.variant);
    },
    onError: (error) => {
      setError(error);
    },
  });

  useEffect(() => {
    if (data && data.variant) {
      setVariant(data.variant);
    }
  }, [data]);

  // Check if the variant is defined before rendering it
  const renderedVariant = variant !== undefined ? variant : fallbackMessage;

  if (isLoading) {
    return <div>{renderedVariant}</div>; // Show the fallback message while loading
  }

  if (error) {
    // Handle the error appropriately, e.g., logging, showing an error message, etc.
    console.error(error);
    return <div>An error occurred while loading the variant.</div>;
  }

  return (
    <div aria-label="Sustainability challenge message">
      {variant === 'A' ? messageA : messageB}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '@ecoteam-hub/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...' }) => {
  const [variant, setVariant] = useState(fallbackMessage);
  const [error, setError] = useState(null);

  const { isLoading, data } = useA/BTesting('sustainability-challenge-message', {
    onSuccess: (responseData) => {
      setVariant(responseData.variant);
    },
    onError: (error) => {
      setError(error);
    },
  });

  useEffect(() => {
    if (data && data.variant) {
      setVariant(data.variant);
    }
  }, [data]);

  // Check if the variant is defined before rendering it
  const renderedVariant = variant !== undefined ? variant : fallbackMessage;

  if (isLoading) {
    return <div>{renderedVariant}</div>; // Show the fallback message while loading
  }

  if (error) {
    // Handle the error appropriately, e.g., logging, showing an error message, etc.
    console.error(error);
    return <div>An error occurred while loading the variant.</div>;
  }

  return (
    <div aria-label="Sustainability challenge message">
      {variant === 'A' ? messageA : messageB}
    </div>
  );
};

export default MyComponent;