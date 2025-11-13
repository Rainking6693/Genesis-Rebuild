import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once, outside the component, to prevent multiple initializations
function initializeStripe(stripePublishableKey: string | undefined): Promise<Stripe | null> {
  if (!stripePublishableKey) {
    console.warn(
      'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.'
    );
    return Promise.resolve(null); // Resolve with null to avoid errors later
  }

  return loadStripe(stripePublishableKey);
}

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  quantity?: number;
  mode: 'subscription' | 'payment'; // Explicitly define the mode
  buttonText?: string; // Customizable button text
  className?: string; // Allow custom styling
  onSuccess?: () => void; // Callback for successful checkout redirection
  onError?: (error: string) => void; // Callback for checkout errors
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  successUrl,
  cancelUrl,
  quantity = 1,
  mode,
  buttonText = 'Subscribe',
  className,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for focus management

  useEffect(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeKey) {
      const errorMessage = 'Stripe publishable key is missing.';
      setStripeError(errorMessage);
      onError?.(errorMessage); // Call onError callback
      return;
    }

    stripePromise = initializeStripe(stripeKey);

    stripePromise.then((stripe) => {
      if (!stripe) {
        const errorMessage = 'Failed to initialize Stripe.';
        setStripeError(errorMessage);
        onError?.(errorMessage); // Call onError callback
      } else {
        setIsStripeInitialized(true);
      }
    });
  }, [onError]);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsLoading(true);
      setStripeError(null);

      try {
        if (!isStripeInitialized) {
          const errorMessage = 'Stripe is not initialized. Please wait and try again.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
          return;
        }

        const stripe = await stripePromise;

        if (!stripe) {
          console.error('Stripe failed to load.');
          const errorMessage = 'Stripe failed to load. Please try again later.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
          return;
        }

        const { error } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: quantity }],
          mode: mode,
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (error) {
          console.warn('Stripe checkout error:', error);
          const errorMessage = error.message || 'An error occurred during checkout.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
        } else {
          onSuccess?.(); // Call onSuccess callback after successful redirection
        }
      } catch (error: any) {
        console.error('Error during Stripe checkout:', error);
        const errorMessage =
          error.message || 'An unexpected error occurred. Please try again later.';
        setStripeError(errorMessage);
        onError?.(errorMessage); // Call onError callback
      } finally {
        setIsLoading(false);
        if (buttonRef.current) {
          buttonRef.current.focus(); // Return focus to the button after the operation
        }
      }
    },
    [
      priceId,
      successUrl,
      cancelUrl,
      quantity,
      mode,
      isStripeInitialized,
      onSuccess,
      onError,
    ]
  );

  const buttonStyle = {
    padding: '0.75em 1.5em',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor:
      isLoading || stripeError !== null || !isStripeInitialized
        ? 'not-allowed'
        : 'pointer',
    opacity:
      isLoading || stripeError !== null || !isStripeInitialized ? 0.7 : 1,
  };

  return (
    <div>
      {stripeError && (
        <div
          style={{
            color: 'red',
            padding: '0.5em',
            marginBottom: '0.5em',
            border: '1px solid red',
            borderRadius: '4px',
          }}
          role="alert"
        >
          Error: {stripeError}
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isLoading || stripeError !== null || !isStripeInitialized}
        aria-disabled={isLoading || stripeError !== null || !isStripeInitialized}
        style={buttonStyle}
        className={className} // Apply custom styles
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default StripeCheckout;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once, outside the component, to prevent multiple initializations
function initializeStripe(stripePublishableKey: string | undefined): Promise<Stripe | null> {
  if (!stripePublishableKey) {
    console.warn(
      'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.'
    );
    return Promise.resolve(null); // Resolve with null to avoid errors later
  }

  return loadStripe(stripePublishableKey);
}

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  quantity?: number;
  mode: 'subscription' | 'payment'; // Explicitly define the mode
  buttonText?: string; // Customizable button text
  className?: string; // Allow custom styling
  onSuccess?: () => void; // Callback for successful checkout redirection
  onError?: (error: string) => void; // Callback for checkout errors
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  successUrl,
  cancelUrl,
  quantity = 1,
  mode,
  buttonText = 'Subscribe',
  className,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for focus management

  useEffect(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeKey) {
      const errorMessage = 'Stripe publishable key is missing.';
      setStripeError(errorMessage);
      onError?.(errorMessage); // Call onError callback
      return;
    }

    stripePromise = initializeStripe(stripeKey);

    stripePromise.then((stripe) => {
      if (!stripe) {
        const errorMessage = 'Failed to initialize Stripe.';
        setStripeError(errorMessage);
        onError?.(errorMessage); // Call onError callback
      } else {
        setIsStripeInitialized(true);
      }
    });
  }, [onError]);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsLoading(true);
      setStripeError(null);

      try {
        if (!isStripeInitialized) {
          const errorMessage = 'Stripe is not initialized. Please wait and try again.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
          return;
        }

        const stripe = await stripePromise;

        if (!stripe) {
          console.error('Stripe failed to load.');
          const errorMessage = 'Stripe failed to load. Please try again later.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
          return;
        }

        const { error } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: quantity }],
          mode: mode,
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (error) {
          console.warn('Stripe checkout error:', error);
          const errorMessage = error.message || 'An error occurred during checkout.';
          setStripeError(errorMessage);
          onError?.(errorMessage); // Call onError callback
        } else {
          onSuccess?.(); // Call onSuccess callback after successful redirection
        }
      } catch (error: any) {
        console.error('Error during Stripe checkout:', error);
        const errorMessage =
          error.message || 'An unexpected error occurred. Please try again later.';
        setStripeError(errorMessage);
        onError?.(errorMessage); // Call onError callback
      } finally {
        setIsLoading(false);
        if (buttonRef.current) {
          buttonRef.current.focus(); // Return focus to the button after the operation
        }
      }
    },
    [
      priceId,
      successUrl,
      cancelUrl,
      quantity,
      mode,
      isStripeInitialized,
      onSuccess,
      onError,
    ]
  );

  const buttonStyle = {
    padding: '0.75em 1.5em',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor:
      isLoading || stripeError !== null || !isStripeInitialized
        ? 'not-allowed'
        : 'pointer',
    opacity:
      isLoading || stripeError !== null || !isStripeInitialized ? 0.7 : 1,
  };

  return (
    <div>
      {stripeError && (
        <div
          style={{
            color: 'red',
            padding: '0.5em',
            marginBottom: '0.5em',
            border: '1px solid red',
            borderRadius: '4px',
          }}
          role="alert"
        >
          Error: {stripeError}
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isLoading || stripeError !== null || !isStripeInitialized}
        aria-disabled={isLoading || stripeError !== null || !isStripeInitialized}
        style={buttonStyle}
        className={className} // Apply custom styles
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default StripeCheckout;