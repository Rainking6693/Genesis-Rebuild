import React, { useEffect, useState, useCallback } from 'react';
import { Stripe, loadStripe, StripeError } from '@stripe/stripe-js';

// Consider moving this to a separate file and memoizing it for performance
const stripePromise = (() => {
  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    console.error('Stripe publishable key is missing.  Ensure REACT_APP_STRIPE_PUBLISHABLE_KEY is set in your environment.');
    return Promise.reject(new Error('Stripe publishable key is missing.'));
  }
  try {
    return loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  } catch (err) {
    console.error('Error loading Stripe:', err);
    return Promise.reject(new Error('Failed to load Stripe.'));
  }
})();

interface Props {
  clientSecret: string;
  onSuccess?: () => void; // Optional success callback
  onError?: (error: StripeError | Error) => void; // Optional error callback
}

const StripeCheckout: React.FC<Props> = ({ clientSecret, onSuccess, onError }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [error, setError] = useState<StripeError | Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Stripe instance
  useEffect(() => {
    stripePromise
      .then((instance) => {
        setStripe(instance);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Failed to load Stripe:', err);
        setError(err);
        setLoading(false);
        onError?.(err); // Call onError callback if provided
      });
  }, []);

  // useCallback to memoize the function and prevent unnecessary re-renders
  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        setError(new Error('Stripe is still loading. Please wait.'));
        return;
      }

      if (!stripe) {
        const stripeNotLoadedError = new Error('Stripe instance not loaded.');
        setError(stripeNotLoadedError);
        onError?.(stripeNotLoadedError); // Call onError callback if provided
        return;
      }

      try {
        const { error: stripeError, } = await stripe.redirectToCheckout({
          clientSecret,
        });

        if (stripeError) {
          console.error('Stripe checkout error:', stripeError);
          setError(stripeError);
          onError?.(stripeError); // Call onError callback if provided
        } else {
          onSuccess?.(); // Call onSuccess callback if provided.  Stripe handles redirect.
        }
      } catch (apiError: any) {
        console.error('Error during checkout:', apiError);
        setError(apiError);
        onError?.(apiError); // Call onError callback if provided
      }
    },
    [clientSecret, stripe, loading, onError, onSuccess]
  );

  // Consider using a more descriptive loading message
  if (loading) {
    return <div>Loading payment...</div>;
  }

  return (
    <>
      {error && (
        <div role="alert" aria-live="assertive">
          Error: {error.message}
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <button type="submit" disabled={!!error} aria-busy={loading}>
          {error ? `Error: ${error.message}` : 'Pay with Stripe'}
        </button>
      </form>
    </>
  );
};

export default StripeCheckout;

import React, { useEffect, useState, useCallback } from 'react';
import { Stripe, loadStripe, StripeError } from '@stripe/stripe-js';

// Consider moving this to a separate file and memoizing it for performance
const stripePromise = (() => {
  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    console.error('Stripe publishable key is missing.  Ensure REACT_APP_STRIPE_PUBLISHABLE_KEY is set in your environment.');
    return Promise.reject(new Error('Stripe publishable key is missing.'));
  }
  try {
    return loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  } catch (err) {
    console.error('Error loading Stripe:', err);
    return Promise.reject(new Error('Failed to load Stripe.'));
  }
})();

interface Props {
  clientSecret: string;
  onSuccess?: () => void; // Optional success callback
  onError?: (error: StripeError | Error) => void; // Optional error callback
}

const StripeCheckout: React.FC<Props> = ({ clientSecret, onSuccess, onError }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [error, setError] = useState<StripeError | Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Stripe instance
  useEffect(() => {
    stripePromise
      .then((instance) => {
        setStripe(instance);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('Failed to load Stripe:', err);
        setError(err);
        setLoading(false);
        onError?.(err); // Call onError callback if provided
      });
  }, []);

  // useCallback to memoize the function and prevent unnecessary re-renders
  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        setError(new Error('Stripe is still loading. Please wait.'));
        return;
      }

      if (!stripe) {
        const stripeNotLoadedError = new Error('Stripe instance not loaded.');
        setError(stripeNotLoadedError);
        onError?.(stripeNotLoadedError); // Call onError callback if provided
        return;
      }

      try {
        const { error: stripeError, } = await stripe.redirectToCheckout({
          clientSecret,
        });

        if (stripeError) {
          console.error('Stripe checkout error:', stripeError);
          setError(stripeError);
          onError?.(stripeError); // Call onError callback if provided
        } else {
          onSuccess?.(); // Call onSuccess callback if provided.  Stripe handles redirect.
        }
      } catch (apiError: any) {
        console.error('Error during checkout:', apiError);
        setError(apiError);
        onError?.(apiError); // Call onError callback if provided
      }
    },
    [clientSecret, stripe, loading, onError, onSuccess]
  );

  // Consider using a more descriptive loading message
  if (loading) {
    return <div>Loading payment...</div>;
  }

  return (
    <>
      {error && (
        <div role="alert" aria-live="assertive">
          Error: {error.message}
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <button type="submit" disabled={!!error} aria-busy={loading}>
          {error ? `Error: ${error.message}` : 'Pay with Stripe'}
        </button>
      </form>
    </>
  );
};

export default StripeCheckout;