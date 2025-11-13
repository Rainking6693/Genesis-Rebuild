import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  buttonText?: string;
  loadingText?: string;
  stripePublishableKey?: string;
  onError?: (error: Error | null, message?: string) => void;
  onSuccess?: () => void; // Callback for successful checkout redirection
  className?: string; // Allow custom styling
  disabled?: boolean; // Allow disabling the button from the outside
}

const StripeBilling: React.FC<Props> = ({
  priceId,
  successUrl,
  cancelUrl,
  buttonText = 'Subscribe',
  loadingText = 'Loading...',
  stripePublishableKey,
  onError,
  onSuccess,
  className = '',
  disabled = false,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false); // Track component mount status

  const publishableKey = stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  // Initialize Stripe only once when the component mounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false when unmounting
    };
  }, []);

  const initializeStripe = useCallback(async () => {
    if (!publishableKey) {
      const errorMessage =
        'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set or pass stripePublishableKey prop.';
      console.error(errorMessage);
      if (isMounted.current) {
        setError(new Error(errorMessage));
      }
      onError?.(new Error(errorMessage), errorMessage);
      return;
    }

    try {
      const stripeInstance = await loadStripe(publishableKey);
      if (stripeInstance) {
        if (isMounted.current) {
          setStripe(stripeInstance);
        }
      } else {
        const errorMessage =
          'Stripe initialization failed. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is valid.';
        console.error(errorMessage);
        if (isMounted.current) {
          setError(new Error(errorMessage));
        }
        onError?.(new Error(errorMessage), errorMessage);
      }
    } catch (err) {
      const errorMessage = `Error initializing Stripe: ${(err as Error).message}`;
      console.error(errorMessage, err);
      if (isMounted.current) {
        setError(err as Error);
      }
      onError?.(err as Error, errorMessage);
    }
  }, [publishableKey, onError]);

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
        if (isMounted.current) {
          setError(new Error(errorMessage));
        }
        onError?.(new Error(errorMessage), errorMessage);
        return;
      }

      setLoading(true);

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          const errorMessage = `Stripe checkout error: ${stripeError.message}`;
          console.error(errorMessage, stripeError);
          if (isMounted.current) {
            setError(new Error(errorMessage));
          }
          onError?.(new Error(errorMessage), errorMessage);
        } else {
          // Optionally, call onSuccess here if redirection is successful.
          // However, a more robust solution would involve server-side confirmation.
          onSuccess?.();
        }
      } catch (err) {
        const errorMessage = `Error redirecting to checkout: ${(err as Error).message}`;
        console.error(errorMessage, err);
        if (isMounted.current) {
          setError(err as Error);
        }
        onError?.(err as Error, errorMessage);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [stripe, priceId, successUrl, cancelUrl, onError, onSuccess]
  );

  const isDisabled = disabled || loading || !stripe || !!error;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      role="button"
      className={className} // Apply custom styles
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1, // Indicate disabled state visually
        ...(className ? {} : { // Apply default styles only if className is not provided
          padding: '10px 20px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f0f0f0',
          ':focus': {
            outline: '2px solid blue', // Basic focus style
          },
        }),
      }}
    >
      {loading ? loadingText : buttonText}
    </button>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  buttonText?: string;
  loadingText?: string;
  stripePublishableKey?: string;
  onError?: (error: Error | null, message?: string) => void;
  onSuccess?: () => void; // Callback for successful checkout redirection
  className?: string; // Allow custom styling
  disabled?: boolean; // Allow disabling the button from the outside
}

const StripeBilling: React.FC<Props> = ({
  priceId,
  successUrl,
  cancelUrl,
  buttonText = 'Subscribe',
  loadingText = 'Loading...',
  stripePublishableKey,
  onError,
  onSuccess,
  className = '',
  disabled = false,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false); // Track component mount status

  const publishableKey = stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  // Initialize Stripe only once when the component mounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false when unmounting
    };
  }, []);

  const initializeStripe = useCallback(async () => {
    if (!publishableKey) {
      const errorMessage =
        'Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set or pass stripePublishableKey prop.';
      console.error(errorMessage);
      if (isMounted.current) {
        setError(new Error(errorMessage));
      }
      onError?.(new Error(errorMessage), errorMessage);
      return;
    }

    try {
      const stripeInstance = await loadStripe(publishableKey);
      if (stripeInstance) {
        if (isMounted.current) {
          setStripe(stripeInstance);
        }
      } else {
        const errorMessage =
          'Stripe initialization failed. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is valid.';
        console.error(errorMessage);
        if (isMounted.current) {
          setError(new Error(errorMessage));
        }
        onError?.(new Error(errorMessage), errorMessage);
      }
    } catch (err) {
      const errorMessage = `Error initializing Stripe: ${(err as Error).message}`;
      console.error(errorMessage, err);
      if (isMounted.current) {
        setError(err as Error);
      }
      onError?.(err as Error, errorMessage);
    }
  }, [publishableKey, onError]);

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
        if (isMounted.current) {
          setError(new Error(errorMessage));
        }
        onError?.(new Error(errorMessage), errorMessage);
        return;
      }

      setLoading(true);

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          const errorMessage = `Stripe checkout error: ${stripeError.message}`;
          console.error(errorMessage, stripeError);
          if (isMounted.current) {
            setError(new Error(errorMessage));
          }
          onError?.(new Error(errorMessage), errorMessage);
        } else {
          // Optionally, call onSuccess here if redirection is successful.
          // However, a more robust solution would involve server-side confirmation.
          onSuccess?.();
        }
      } catch (err) {
        const errorMessage = `Error redirecting to checkout: ${(err as Error).message}`;
        console.error(errorMessage, err);
        if (isMounted.current) {
          setError(err as Error);
        }
        onError?.(err as Error, errorMessage);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [stripe, priceId, successUrl, cancelUrl, onError, onSuccess]
  );

  const isDisabled = disabled || loading || !stripe || !!error;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      role="button"
      className={className} // Apply custom styles
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1, // Indicate disabled state visually
        ...(className ? {} : { // Apply default styles only if className is not provided
          padding: '10px 20px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f0f0f0',
          ':focus': {
            outline: '2px solid blue', // Basic focus style
          },
        }),
      }}
    >
      {loading ? loadingText : buttonText}
    </button>
  );
};

export default StripeBilling;