import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface StripeCheckoutProps {
  priceId: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  buttonClassName?: string;
  onError?: (error: Error) => void;
  // Optional prop for customizing the button text
  buttonText?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  quantity = 1,
  successUrl,
  cancelUrl,
  buttonClassName,
  onError,
  buttonText = 'Checkout with Stripe',
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true); // Track Stripe loading state

  const initializeStripe = useCallback(async () => {
    setIsStripeLoading(true);
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!publishableKey) {
        const missingKeyError = new Error(
          'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.'
        );
        console.error(missingKeyError.message);
        setError(missingKeyError);
        onError?.(missingKeyError);
        return;
      }

      const stripeInstance = await loadStripe(publishableKey);

      if (!stripeInstance) {
        const loadFailedError = new Error('Failed to load Stripe.');
        console.error(loadFailedError.message);
        setError(loadFailedError);
        onError?.(loadFailedError);
        return;
      }

      setStripe(stripeInstance);
    } catch (error) {
      const stripeError =
        error instanceof Error ? error : new Error(String(error));
      console.error('Error loading Stripe:', stripeError);
      setError(stripeError);
      onError?.(stripeError);
    } finally {
      setIsStripeLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const redirectToCheckout = useCallback(async () => {
    if (!stripe) {
      const notInitializedError = new Error('Stripe not initialized.');
      console.error(notInitializedError.message);
      setError(notInitializedError);
      onError?.(notInitializedError);
      return;
    }

    if (!priceId) {
      const missingPriceIdError = new Error('Price ID is required.');
      console.error(missingPriceIdError.message);
      setError(missingPriceIdError);
      onError?.(missingPriceIdError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity }],
        mode: 'payment',
        successUrl,
        cancelUrl,
      });

      if (stripeError) {
        console.error('Stripe checkout error:', stripeError);
        setError(stripeError);
        onError?.(stripeError);

        // User-friendly error display (consider using a modal or toast)
        alert(`Checkout failed: ${stripeError.message}`);
      }
    } catch (error) {
      const checkoutError =
        error instanceof Error ? error : new Error(String(error));
      console.error('Error redirecting to checkout:', checkoutError);
      setError(checkoutError);
      onError?.(checkoutError);

      // User-friendly error display (consider using a modal or toast)
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stripe, priceId, quantity, successUrl, cancelUrl, onError]);

  // Handle cases where Stripe fails to load initially
  if (isStripeLoading) {
    return (
      <button disabled className={buttonClassName} aria-label="Loading Stripe...">
        Loading...
      </button>
    );
  }

  const buttonLabel = loading ? 'Processing...' : buttonText;

  return (
    <>
      <button
        onClick={redirectToCheckout}
        disabled={loading || !stripe || !!error}
        className={buttonClassName}
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </button>

      {error && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </>
  );
};

export default StripeCheckout;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface StripeCheckoutProps {
  priceId: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  buttonClassName?: string;
  onError?: (error: Error) => void;
  // Optional prop for customizing the button text
  buttonText?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  quantity = 1,
  successUrl,
  cancelUrl,
  buttonClassName,
  onError,
  buttonText = 'Checkout with Stripe',
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true); // Track Stripe loading state

  const initializeStripe = useCallback(async () => {
    setIsStripeLoading(true);
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!publishableKey) {
        const missingKeyError = new Error(
          'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.'
        );
        console.error(missingKeyError.message);
        setError(missingKeyError);
        onError?.(missingKeyError);
        return;
      }

      const stripeInstance = await loadStripe(publishableKey);

      if (!stripeInstance) {
        const loadFailedError = new Error('Failed to load Stripe.');
        console.error(loadFailedError.message);
        setError(loadFailedError);
        onError?.(loadFailedError);
        return;
      }

      setStripe(stripeInstance);
    } catch (error) {
      const stripeError =
        error instanceof Error ? error : new Error(String(error));
      console.error('Error loading Stripe:', stripeError);
      setError(stripeError);
      onError?.(stripeError);
    } finally {
      setIsStripeLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const redirectToCheckout = useCallback(async () => {
    if (!stripe) {
      const notInitializedError = new Error('Stripe not initialized.');
      console.error(notInitializedError.message);
      setError(notInitializedError);
      onError?.(notInitializedError);
      return;
    }

    if (!priceId) {
      const missingPriceIdError = new Error('Price ID is required.');
      console.error(missingPriceIdError.message);
      setError(missingPriceIdError);
      onError?.(missingPriceIdError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity }],
        mode: 'payment',
        successUrl,
        cancelUrl,
      });

      if (stripeError) {
        console.error('Stripe checkout error:', stripeError);
        setError(stripeError);
        onError?.(stripeError);

        // User-friendly error display (consider using a modal or toast)
        alert(`Checkout failed: ${stripeError.message}`);
      }
    } catch (error) {
      const checkoutError =
        error instanceof Error ? error : new Error(String(error));
      console.error('Error redirecting to checkout:', checkoutError);
      setError(checkoutError);
      onError?.(checkoutError);

      // User-friendly error display (consider using a modal or toast)
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stripe, priceId, quantity, successUrl, cancelUrl, onError]);

  // Handle cases where Stripe fails to load initially
  if (isStripeLoading) {
    return (
      <button disabled className={buttonClassName} aria-label="Loading Stripe...">
        Loading...
      </button>
    );
  }

  const buttonLabel = loading ? 'Processing...' : buttonText;

  return (
    <>
      <button
        onClick={redirectToCheckout}
        disabled={loading || !stripe || !!error}
        className={buttonClassName}
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </button>

      {error && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </>
  );
};

export default StripeCheckout;