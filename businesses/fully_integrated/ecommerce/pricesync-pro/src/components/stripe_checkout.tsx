import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once to prevent multiple initializations
function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').then(stripe => {
      if (!stripe) {
        console.error("StripeCheckout: Stripe failed to load during initial promise creation.");
      }
      return stripe;
    }).catch(error => {
      console.error("StripeCheckout: Error loading Stripe during initial promise creation:", error);
      return null; // Return null to indicate Stripe failed to load
    });
  }
  return stripePromise;
}

interface StripeCheckoutProps {
  priceId: string; // The Stripe Price ID for the product
  successUrl: string; // URL to redirect to on successful payment
  cancelUrl: string; // URL to redirect to if the payment is cancelled
  quantity?: number; // Optional quantity, defaults to 1
  mode?: 'subscription' | 'payment'; // Optional mode, defaults to 'subscription'
  buttonText?: string; // Optional text for the button
  onError?: (error: Error) => void; // Optional callback for handling errors
  className?: string; // Optional CSS class name for the button
  style?: React.CSSProperties; // Optional inline styles for the button
  disabled?: boolean; // Optional prop to disable the button externally
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  successUrl,
  cancelUrl,
  quantity = 1,
  mode = 'subscription',
  buttonText = 'Subscribe with Stripe',
  onError,
  className,
  style,
  disabled: externalDisabled = false, // Renamed to avoid shadowing
}) => {
  const [loading, setLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeAvailable, setIsStripeAvailable] = useState(true);

  useEffect(() => {
    getStripePromise().then(stripe => {
      setIsStripeAvailable(!!stripe);
    });
  }, []);

  // Input validation using useCallback to memoize the function
  const validateProps = useCallback(() => {
    if (!priceId) {
      console.error("StripeCheckout: priceId is required.");
      return false;
    }
    if (!successUrl) {
      console.error("StripeCheckout: successUrl is required.");
      return false;
    }
    if (!cancelUrl) {
      console.error("StripeCheckout: cancelUrl is required.");
      return false;
    }
    if (quantity <= 0) {
      console.error("StripeCheckout: quantity must be greater than 0.");
      return false;
    }
    return true;
  }, [priceId, successUrl, cancelUrl, quantity]);

  useEffect(() => {
    validateProps();
  }, [validateProps]);

  // Memoize the handleClick function using useCallback
  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setStripeError(null); // Clear any previous errors

    if (!validateProps()) {
      return;
    }

    if (!isStripeAvailable) {
      const errorMessage = "Stripe is not available. Please check your internet connection or Stripe configuration.";
      console.error(errorMessage);
      setStripeError(errorMessage);
      onError?.(new Error(errorMessage));
      return;
    }

    setLoading(true);

    try {
      const stripe = await getStripePromise();

      if (!stripe) {
        const errorMessage = "StripeCheckout: Stripe failed to load.";
        console.error(errorMessage);
        setStripeError(errorMessage);
        onError?.(new Error(errorMessage));
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity }],
        mode: mode,
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.warn("StripeCheckout: Error redirecting to checkout:", error);
        setStripeError(error.message);
        onError?.(error);
      }
    } catch (error: any) {
      console.error("StripeCheckout: Error during checkout:", error);
      let errorMessage = "An error occurred during checkout. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStripeError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage)); // Ensure onError receives an Error object
    } finally {
      setLoading(false);
    }
  }, [priceId, successUrl, cancelUrl, quantity, mode, validateProps, onError, isStripeAvailable]);

  const isDisabled = externalDisabled || loading || !isStripeAvailable;

  return (
    <>
      <button
        role="link"
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={loading ? 'Redirecting to Stripe...' : buttonText}
        className={className}
        style={style}
      >
        {loading ? 'Redirecting to Stripe...' : buttonText}
      </button>
      {stripeError && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {stripeError}
        </div>
      )}
      {!isStripeAvailable && (
        <div role="alert" style={{ color: 'orange' }}>
          Stripe is not available. Please check your internet connection or Stripe configuration.
        </div>
      )}
    </>
  );
};

export default StripeCheckout;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once to prevent multiple initializations
function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').then(stripe => {
      if (!stripe) {
        console.error("StripeCheckout: Stripe failed to load during initial promise creation.");
      }
      return stripe;
    }).catch(error => {
      console.error("StripeCheckout: Error loading Stripe during initial promise creation:", error);
      return null; // Return null to indicate Stripe failed to load
    });
  }
  return stripePromise;
}

interface StripeCheckoutProps {
  priceId: string; // The Stripe Price ID for the product
  successUrl: string; // URL to redirect to on successful payment
  cancelUrl: string; // URL to redirect to if the payment is cancelled
  quantity?: number; // Optional quantity, defaults to 1
  mode?: 'subscription' | 'payment'; // Optional mode, defaults to 'subscription'
  buttonText?: string; // Optional text for the button
  onError?: (error: Error) => void; // Optional callback for handling errors
  className?: string; // Optional CSS class name for the button
  style?: React.CSSProperties; // Optional inline styles for the button
  disabled?: boolean; // Optional prop to disable the button externally
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  successUrl,
  cancelUrl,
  quantity = 1,
  mode = 'subscription',
  buttonText = 'Subscribe with Stripe',
  onError,
  className,
  style,
  disabled: externalDisabled = false, // Renamed to avoid shadowing
}) => {
  const [loading, setLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeAvailable, setIsStripeAvailable] = useState(true);

  useEffect(() => {
    getStripePromise().then(stripe => {
      setIsStripeAvailable(!!stripe);
    });
  }, []);

  // Input validation using useCallback to memoize the function
  const validateProps = useCallback(() => {
    if (!priceId) {
      console.error("StripeCheckout: priceId is required.");
      return false;
    }
    if (!successUrl) {
      console.error("StripeCheckout: successUrl is required.");
      return false;
    }
    if (!cancelUrl) {
      console.error("StripeCheckout: cancelUrl is required.");
      return false;
    }
    if (quantity <= 0) {
      console.error("StripeCheckout: quantity must be greater than 0.");
      return false;
    }
    return true;
  }, [priceId, successUrl, cancelUrl, quantity]);

  useEffect(() => {
    validateProps();
  }, [validateProps]);

  // Memoize the handleClick function using useCallback
  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setStripeError(null); // Clear any previous errors

    if (!validateProps()) {
      return;
    }

    if (!isStripeAvailable) {
      const errorMessage = "Stripe is not available. Please check your internet connection or Stripe configuration.";
      console.error(errorMessage);
      setStripeError(errorMessage);
      onError?.(new Error(errorMessage));
      return;
    }

    setLoading(true);

    try {
      const stripe = await getStripePromise();

      if (!stripe) {
        const errorMessage = "StripeCheckout: Stripe failed to load.";
        console.error(errorMessage);
        setStripeError(errorMessage);
        onError?.(new Error(errorMessage));
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity }],
        mode: mode,
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.warn("StripeCheckout: Error redirecting to checkout:", error);
        setStripeError(error.message);
        onError?.(error);
      }
    } catch (error: any) {
      console.error("StripeCheckout: Error during checkout:", error);
      let errorMessage = "An error occurred during checkout. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStripeError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage)); // Ensure onError receives an Error object
    } finally {
      setLoading(false);
    }
  }, [priceId, successUrl, cancelUrl, quantity, mode, validateProps, onError, isStripeAvailable]);

  const isDisabled = externalDisabled || loading || !isStripeAvailable;

  return (
    <>
      <button
        role="link"
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={loading ? 'Redirecting to Stripe...' : buttonText}
        className={className}
        style={style}
      >
        {loading ? 'Redirecting to Stripe...' : buttonText}
      </button>
      {stripeError && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {stripeError}
        </div>
      )}
      {!isStripeAvailable && (
        <div role="alert" style={{ color: 'orange' }}>
          Stripe is not available. Please check your internet connection or Stripe configuration.
        </div>
      )}
    </>
  );
};

export default StripeCheckout;