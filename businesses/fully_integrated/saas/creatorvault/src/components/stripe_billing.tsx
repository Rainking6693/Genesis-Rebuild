import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Consider using a more robust configuration management solution, e.g., a dedicated config file or a service.
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface SubscriptionButtonProps {
  priceId: string;
  creatorId: string;
  successUrl?: string;
  cancelUrl?: string;
  buttonText?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean; // Prop to externally control button's disabled state
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  priceId,
  creatorId,
  successUrl = '/subscription-success',
  cancelUrl = '/subscription-cancel',
  buttonText = 'Subscribe',
  onSuccess,
  onError,
  className = '',
  ariaLabel = 'Subscribe to access premium content',
  disabled = false,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<Error | null>(null);

  // Memoize the loadStripe call to prevent unnecessary re-renders
  const initializeStripe = useCallback(async () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      const errorMessage = "Stripe publishable key is not set. Please configure it in your environment variables.";
      console.error(errorMessage);
      setStripeLoadingError(new Error(errorMessage)); // Use separate state for Stripe loading errors
      return;
    }

    try {
      const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripeInstance) {
        const errorMessage = "Failed to initialize Stripe.  `loadStripe` returned null.";
        console.error(errorMessage);
        setStripeLoadingError(new Error(errorMessage));
        return;
      }
      setStripe(stripeInstance);
    } catch (err: any) {
      console.error("Error loading Stripe:", err);
      setStripeLoadingError(new Error("Failed to load Stripe. Please check your internet connection and try again."));
    }
  }, []);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const handleClick = useCallback(async () => {
    if (!stripe) {
      const errorMessage = "Stripe.js has not loaded yet.";
      console.error(errorMessage);
      setError(new Error(errorMessage));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate URLs before using them.
      let resolvedSuccessUrl: string;
      let resolvedCancelUrl: string;

      try {
        resolvedSuccessUrl = new URL(successUrl, window.location.origin).toString();
        resolvedCancelUrl = new URL(cancelUrl, window.location.origin).toString();
      } catch (urlError: any) {
        console.error("Invalid successUrl or cancelUrl:", urlError);
        setError(new Error("Invalid success or cancel URL provided."));
        if (onError) {
          onError(new Error("Invalid success or cancel URL provided."));
        } else {
          alert("Invalid success or cancel URL provided.");
        }
        return;
      }

      const { error: stripeError, sessionId } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${resolvedSuccessUrl}?session_id={CHECKOUT_SESSION_ID}&creator_id=${creatorId}`,
        cancelUrl: `${resolvedCancelUrl}?creator_id=${creatorId}`,
      });

      if (stripeError) {
        console.error("Stripe checkout error:", stripeError);
        setError(stripeError);
        if (onError) {
          onError(stripeError);
        } else {
          alert(`Stripe checkout error: ${stripeError.message}`);
        }
      } else if (sessionId && onSuccess) {
          onSuccess(sessionId);
      }
    } catch (err: any) {
      console.error("Error redirecting to Stripe checkout:", err);
      setError(new Error("An error occurred during checkout. Please try again."));
      if (onError) {
        onError(err);
      } else {
        alert("An error occurred during checkout. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [stripe, priceId, creatorId, successUrl, cancelUrl, onError, onSuccess]);

  const buttonDisabled = disabled || loading || !!stripeLoadingError;

  // Handle cases where Stripe fails to load gracefully
  if (stripeLoadingError) {
    return (
      <div role="alert" aria-live="assertive">
        <p>Error: {stripeLoadingError.message}</p>
        <button onClick={initializeStripe}>Retry Loading Stripe</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={buttonDisabled}
      className={className}
      aria-label={ariaLabel}
    >
      {loading ? 'Loading...' : buttonText}
    </button>
  );
};

export default SubscriptionButton;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Consider using a more robust configuration management solution, e.g., a dedicated config file or a service.
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface SubscriptionButtonProps {
  priceId: string;
  creatorId: string;
  successUrl?: string;
  cancelUrl?: string;
  buttonText?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean; // Prop to externally control button's disabled state
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  priceId,
  creatorId,
  successUrl = '/subscription-success',
  cancelUrl = '/subscription-cancel',
  buttonText = 'Subscribe',
  onSuccess,
  onError,
  className = '',
  ariaLabel = 'Subscribe to access premium content',
  disabled = false,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<Error | null>(null);

  // Memoize the loadStripe call to prevent unnecessary re-renders
  const initializeStripe = useCallback(async () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      const errorMessage = "Stripe publishable key is not set. Please configure it in your environment variables.";
      console.error(errorMessage);
      setStripeLoadingError(new Error(errorMessage)); // Use separate state for Stripe loading errors
      return;
    }

    try {
      const stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripeInstance) {
        const errorMessage = "Failed to initialize Stripe.  `loadStripe` returned null.";
        console.error(errorMessage);
        setStripeLoadingError(new Error(errorMessage));
        return;
      }
      setStripe(stripeInstance);
    } catch (err: any) {
      console.error("Error loading Stripe:", err);
      setStripeLoadingError(new Error("Failed to load Stripe. Please check your internet connection and try again."));
    }
  }, []);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const handleClick = useCallback(async () => {
    if (!stripe) {
      const errorMessage = "Stripe.js has not loaded yet.";
      console.error(errorMessage);
      setError(new Error(errorMessage));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate URLs before using them.
      let resolvedSuccessUrl: string;
      let resolvedCancelUrl: string;

      try {
        resolvedSuccessUrl = new URL(successUrl, window.location.origin).toString();
        resolvedCancelUrl = new URL(cancelUrl, window.location.origin).toString();
      } catch (urlError: any) {
        console.error("Invalid successUrl or cancelUrl:", urlError);
        setError(new Error("Invalid success or cancel URL provided."));
        if (onError) {
          onError(new Error("Invalid success or cancel URL provided."));
        } else {
          alert("Invalid success or cancel URL provided.");
        }
        return;
      }

      const { error: stripeError, sessionId } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${resolvedSuccessUrl}?session_id={CHECKOUT_SESSION_ID}&creator_id=${creatorId}`,
        cancelUrl: `${resolvedCancelUrl}?creator_id=${creatorId}`,
      });

      if (stripeError) {
        console.error("Stripe checkout error:", stripeError);
        setError(stripeError);
        if (onError) {
          onError(stripeError);
        } else {
          alert(`Stripe checkout error: ${stripeError.message}`);
        }
      } else if (sessionId && onSuccess) {
          onSuccess(sessionId);
      }
    } catch (err: any) {
      console.error("Error redirecting to Stripe checkout:", err);
      setError(new Error("An error occurred during checkout. Please try again."));
      if (onError) {
        onError(err);
      } else {
        alert("An error occurred during checkout. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [stripe, priceId, creatorId, successUrl, cancelUrl, onError, onSuccess]);

  const buttonDisabled = disabled || loading || !!stripeLoadingError;

  // Handle cases where Stripe fails to load gracefully
  if (stripeLoadingError) {
    return (
      <div role="alert" aria-live="assertive">
        <p>Error: {stripeLoadingError.message}</p>
        <button onClick={initializeStripe}>Retry Loading Stripe</button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={buttonDisabled}
      className={className}
      aria-label={ariaLabel}
    >
      {loading ? 'Loading...' : buttonText}
    </button>
  );
};

export default SubscriptionButton;