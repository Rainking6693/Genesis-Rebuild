import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  stripePublicKey?: string; // Allow overriding the public key for testing/dev
}

const StripeCheckout: React.FC<Props> = ({
  priceId,
  successUrl,
  cancelUrl,
  buttonText = 'Subscribe to EcoShift Analytics',
  onSuccess,
  onError,
  stripePublicKey: propStripePublicKey,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true); // Track Stripe.js loading

  const stripePublicKey = propStripePublicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  const initializeStripe = useCallback(async () => {
    setIsStripeLoading(true);
    if (!stripePublicKey) {
      const errorMessage =
        'Stripe public key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLIC_KEY is set in your environment variables or pass it as a prop.';
      console.error(errorMessage);
      setError(errorMessage);
      setIsStripeLoading(false);
      return;
    }

    try {
      const stripeInstance = await loadStripe(stripePublicKey);
      if (stripeInstance) {
        setStripe(stripeInstance);
      } else {
        const errorMessage = 'Failed to initialize Stripe.';
        console.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = `Error initializing Stripe: ${error?.message || 'Unknown error'}`;
      console.error(errorMessage, error);
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage)); // Call onError for initialization errors
      }
    } finally {
      setIsStripeLoading(false);
    }
  }, [stripePublicKey, onError]);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setError(null);

      if (!stripe) {
        const errorMessage = 'Stripe is not initialized.';
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      setLoading(true);

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          console.error('Stripe checkout error:', stripeError);
          setError(stripeError.message);
          if (onError) {
            onError(new Error(stripeError.message));
          }
        } else {
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error: any) {
        const errorMessage = `Error redirecting to checkout: ${error?.message || 'Unknown error'}`;
        console.error(errorMessage, error);
        setError(errorMessage);
        if (onError) {
          onError(new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    },
    [stripe, priceId, successUrl, cancelUrl, onSuccess, onError]
  );

  const isDisabled = loading || !stripe || error !== null || isStripeLoading;

  let buttonContent = buttonText;
  if (loading) {
    buttonContent = 'Loading...';
  } else if (isStripeLoading) {
    buttonContent = 'Initializing Stripe...'; // More specific loading message
  }

  return (
    <>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        style={{
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
        }}
        aria-disabled={isDisabled}
      >
        {buttonContent}
      </button>
    </>
  );
};

export default StripeCheckout;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  stripePublicKey?: string; // Allow overriding the public key for testing/dev
}

const StripeCheckout: React.FC<Props> = ({
  priceId,
  successUrl,
  cancelUrl,
  buttonText = 'Subscribe to EcoShift Analytics',
  onSuccess,
  onError,
  stripePublicKey: propStripePublicKey,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(true); // Track Stripe.js loading

  const stripePublicKey = propStripePublicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

  const initializeStripe = useCallback(async () => {
    setIsStripeLoading(true);
    if (!stripePublicKey) {
      const errorMessage =
        'Stripe public key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLIC_KEY is set in your environment variables or pass it as a prop.';
      console.error(errorMessage);
      setError(errorMessage);
      setIsStripeLoading(false);
      return;
    }

    try {
      const stripeInstance = await loadStripe(stripePublicKey);
      if (stripeInstance) {
        setStripe(stripeInstance);
      } else {
        const errorMessage = 'Failed to initialize Stripe.';
        console.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = `Error initializing Stripe: ${error?.message || 'Unknown error'}`;
      console.error(errorMessage, error);
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage)); // Call onError for initialization errors
      }
    } finally {
      setIsStripeLoading(false);
    }
  }, [stripePublicKey, onError]);

  useEffect(() => {
    initializeStripe();
  }, [initializeStripe]);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setError(null);

      if (!stripe) {
        const errorMessage = 'Stripe is not initialized.';
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      setLoading(true);

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          lineItems: [{ price: priceId, quantity: 1 }],
          mode: 'subscription',
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          console.error('Stripe checkout error:', stripeError);
          setError(stripeError.message);
          if (onError) {
            onError(new Error(stripeError.message));
          }
        } else {
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error: any) {
        const errorMessage = `Error redirecting to checkout: ${error?.message || 'Unknown error'}`;
        console.error(errorMessage, error);
        setError(errorMessage);
        if (onError) {
          onError(new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    },
    [stripe, priceId, successUrl, cancelUrl, onSuccess, onError]
  );

  const isDisabled = loading || !stripe || error !== null || isStripeLoading;

  let buttonContent = buttonText;
  if (loading) {
    buttonContent = 'Loading...';
  } else if (isStripeLoading) {
    buttonContent = 'Initializing Stripe...'; // More specific loading message
  }

  return (
    <>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        style={{
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
        }}
        aria-disabled={isDisabled}
      >
        {buttonContent}
      </button>
    </>
  );
};

export default StripeCheckout;