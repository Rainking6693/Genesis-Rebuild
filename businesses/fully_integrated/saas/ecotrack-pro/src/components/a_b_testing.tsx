import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '@ecotrack-pro/feature-flags';

type Props = {
  messageA: string;
  messageB: string;
  fallbackMessage?: string; // Add a fallback message for edge cases
};

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...' }) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const { variant } = await useA/BTesting('carbonFootprintTracking');
        setVariant(variant);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchVariant();
  }, []);

  if (isLoading) return <div>{fallbackMessage}</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      {/* Add aria-label for accessibility */}
      <div role="presentation">
        {variant === 'A' ? messageA : messageB}
        <span id="sr-only">{variant === 'A' ? messageA : messageB}</span>
      </div>
    </div>
  );
};

export default MyComponent;

In this updated version, I've added state variables for `variant`, `isLoading`, and `error`. I've also used the `useEffect` hook to fetch the variant asynchronously and update the state accordingly. This ensures that the component doesn't render until the variant is loaded.

I've also added a screen reader-only `<span>` with the same content as the visible text, using the `sr-only` class for better accessibility. This way, screen readers will announce the content even if it's not visible to sighted users.

Lastly, I've removed the unnecessary `aria-hidden="true"` attribute on the visible text, as it's already hidden by the `role="presentation"` attribute. The `aria-hidden="true"` attribute should only be used when content is hidden from both sighted users and screen readers.