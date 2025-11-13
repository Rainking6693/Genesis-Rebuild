import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '../../hooks/useA_BTesting';

interface Props {
  message: string;
  id?: string; // Add optional id for specific tests
}

const MyComponent: React.FC<Props> = ({ message, id = 'carbon-cred-ab-test' }) => {
  const [variant, setVariant] = useState<number | null>(null); // Use useState for state management
  const [error, setError] = useState<Error | null>(null); // Add error state for handling fetch errors

  useEffect(() => {
    const getVariant = async () => {
      try {
        // Fetch the variant from a server or a local storage
        const response = await fetch(`/api/ab-testing/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch variant: ${response.statusText}`);
        }
        const data = await response.json();
        setVariant(data.variant);
      } catch (error) {
        setError(error);
      }
    };

    if (!variant) {
      getVariant(); // Fetch the initial variant
    }
  }, [id, variant]);

  useEffect(() => {
    // Set initial variant to random for even distribution if not fetched yet
    if (!variant && !id) {
      setVariant(Math.random());
    }
  }, []);

  // Add accessibility by wrapping the content in a div with aria-label
  return (
    <div>
      {error ? (
        <div role="alert">{error.message}</div>
      ) : (
        <div aria-label="Test variant">
          {variant === 0 ? message : `Test Variant ${variant}`}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

In this updated version, I've added an error state to handle fetch errors and display an error message when an error occurs. Additionally, I've wrapped the content in a `div` with a `role="alert"` when an error occurs to make it more accessible.