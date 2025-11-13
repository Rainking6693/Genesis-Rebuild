import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  creatorId: string; // Identifier for the creator, used for analytics/tracking
  successUrl?: string; // Optional: Override default success URL
  cancelUrl?: string;  // Optional: Override default cancel URL
  onSuccess?: () => void; // Optional: Callback for successful checkout initiation
  onCancel?: () => void;  // Optional: Callback for cancelled checkout initiation
  onError?: (error: string) => void; // Optional: Callback for errors
  buttonText?: string; // Optional: Customize the button text
  disabled?: boolean; // Optional: Disable the button externally
  className?: string; // Optional: Allow custom styling of the button
  style?: React.CSSProperties; // Optional: Allow inline styling
  id?: string; // Optional: Add an ID to the button for testing or targeting
}

const StripeBilling: React.FC<Props> = ({
  priceId,
  creatorId,
  successUrl,
  cancelUrl,
  onSuccess,
  onCancel,
  onError,
  buttonText = 'Subscribe',
  disabled = false,
  className,
  style,
  id,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<string | null>(null);
  const isMounted = useRef(false); // Track component mount status

  // Memoize the publishable key to prevent unnecessary re-renders.
  const stripePublishableKey = React.useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', []);

  useEffect(() => {
    isMounted.current = true; // Set mount status to true

    if (!stripePublishableKey) {
      const errorMessage = "Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.";
      setStripeLoadingError(errorMessage);
      console.error(errorMessage);
      onError?.(errorMessage); // Report error to parent component
      return;
    }

    const initializeStripe = async () => {
      try {
        const stripePromise = await loadStripe(stripePublishableKey);

        if (!stripePromise) {
          const errorMessage = "Stripe failed to load. Check your publishable key and network connection.";
          setStripeLoadingError(errorMessage);
          console.error(errorMessage);
          onError?.(errorMessage); // Report error to parent component
          return;
        }

        if (isMounted.current) {
            setStripe(stripePromise);
        }
      } catch (err: any) {
        const errorMessage = `Failed to initialize Stripe: ${err.message}`;
        setStripeLoadingError(errorMessage);
        console.error("Stripe initialization error:", err);
        onError?.(errorMessage); // Report error to parent component
      }
    };

    initializeStripe();

    return () => {
      isMounted.current = false; // Set mount status to false on unmount
    };
  }, [stripePublishableKey, onError]);

  const handleCheckout = useCallback(async () => {
    if (!stripe) {
      const errorMessage = "Stripe is not initialized.";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate URLs before passing them to Stripe
      const isValidUrl = (url: string | undefined): boolean => {
        if (!url) return true; // Allow undefined URLs (use default)
        try {
          new URL(url);
          return true;
        } catch (_) {
          return false;
        }
      };

      let resolvedSuccessUrl = successUrl || `${window.location.origin}/success?creatorId=${creatorId}`;
      let resolvedCancelUrl = cancelUrl || `${window.location.origin}/cancel?creatorId=${creatorId}`;

      if (!isValidUrl(resolvedSuccessUrl)) {
        const errorMessage = `Invalid successUrl: ${resolvedSuccessUrl}.  Falling back to default.`;
        console.warn(errorMessage);
        onError?.(errorMessage);
        resolvedSuccessUrl = `${window.location.origin}/success?creatorId=${creatorId}`; // Fallback
      }

      if (!isValidUrl(resolvedCancelUrl)) {
        const errorMessage = `Invalid cancelUrl: ${resolvedCancelUrl}. Falling back to default.`;
        console.warn(errorMessage);
        onError?.(errorMessage);
        resolvedCancelUrl = `${window.location.origin}/cancel?creatorId=${creatorId}`; // Fallback
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: resolvedSuccessUrl,
        cancelUrl: resolvedCancelUrl,
        clientReferenceId: creatorId, // Optional: Useful for associating the session with a creator in Stripe.
      });

      if (stripeError) {
        const errorMessage = `Stripe checkout error: ${stripeError.message}`;
        setError(errorMessage);
        console.error("Stripe checkout error:", stripeError);
        onError?.(errorMessage);
      } else {
        onSuccess?.(); // Call onSuccess only if redirectToCheckout was successful (no immediate error)
      }
    } catch (err: any) {
      const errorMessage = `Failed to initiate checkout: ${err.message}`;
      setError(errorMessage);
      console.error("Checkout initiation error:", err);
      onError?.(errorMessage);
      onCancel?.(); // Consider calling onCancel if checkout initiation fails.
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [stripe, priceId, creatorId, successUrl, cancelUrl, onSuccess, onCancel, onError]);

  const isButtonDisabled = disabled || loading || !stripe;

  const buttonProps = {
    onClick: handleCheckout,
    disabled: isButtonDisabled,
    'aria-disabled': isButtonDisabled, // for accessibility
    className,
    style,
    id,
  };

  return (
    <div>
      {stripeLoadingError && (
        <div className="error" role="alert">
          Error: {stripeLoadingError}
        </div>
      )}

      {error && (
        <div className="error" role="alert">
          Error: {error}
        </div>
      )}

      <button {...buttonProps}>
        {loading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface Props {
  priceId: string;
  creatorId: string; // Identifier for the creator, used for analytics/tracking
  successUrl?: string; // Optional: Override default success URL
  cancelUrl?: string;  // Optional: Override default cancel URL
  onSuccess?: () => void; // Optional: Callback for successful checkout initiation
  onCancel?: () => void;  // Optional: Callback for cancelled checkout initiation
  onError?: (error: string) => void; // Optional: Callback for errors
  buttonText?: string; // Optional: Customize the button text
  disabled?: boolean; // Optional: Disable the button externally
  className?: string; // Optional: Allow custom styling of the button
  style?: React.CSSProperties; // Optional: Allow inline styling
  id?: string; // Optional: Add an ID to the button for testing or targeting
}

const StripeBilling: React.FC<Props> = ({
  priceId,
  creatorId,
  successUrl,
  cancelUrl,
  onSuccess,
  onCancel,
  onError,
  buttonText = 'Subscribe',
  disabled = false,
  className,
  style,
  id,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<string | null>(null);
  const isMounted = useRef(false); // Track component mount status

  // Memoize the publishable key to prevent unnecessary re-renders.
  const stripePublishableKey = React.useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', []);

  useEffect(() => {
    isMounted.current = true; // Set mount status to true

    if (!stripePublishableKey) {
      const errorMessage = "Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.";
      setStripeLoadingError(errorMessage);
      console.error(errorMessage);
      onError?.(errorMessage); // Report error to parent component
      return;
    }

    const initializeStripe = async () => {
      try {
        const stripePromise = await loadStripe(stripePublishableKey);

        if (!stripePromise) {
          const errorMessage = "Stripe failed to load. Check your publishable key and network connection.";
          setStripeLoadingError(errorMessage);
          console.error(errorMessage);
          onError?.(errorMessage); // Report error to parent component
          return;
        }

        if (isMounted.current) {
            setStripe(stripePromise);
        }
      } catch (err: any) {
        const errorMessage = `Failed to initialize Stripe: ${err.message}`;
        setStripeLoadingError(errorMessage);
        console.error("Stripe initialization error:", err);
        onError?.(errorMessage); // Report error to parent component
      }
    };

    initializeStripe();

    return () => {
      isMounted.current = false; // Set mount status to false on unmount
    };
  }, [stripePublishableKey, onError]);

  const handleCheckout = useCallback(async () => {
    if (!stripe) {
      const errorMessage = "Stripe is not initialized.";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate URLs before passing them to Stripe
      const isValidUrl = (url: string | undefined): boolean => {
        if (!url) return true; // Allow undefined URLs (use default)
        try {
          new URL(url);
          return true;
        } catch (_) {
          return false;
        }
      };

      let resolvedSuccessUrl = successUrl || `${window.location.origin}/success?creatorId=${creatorId}`;
      let resolvedCancelUrl = cancelUrl || `${window.location.origin}/cancel?creatorId=${creatorId}`;

      if (!isValidUrl(resolvedSuccessUrl)) {
        const errorMessage = `Invalid successUrl: ${resolvedSuccessUrl}.  Falling back to default.`;
        console.warn(errorMessage);
        onError?.(errorMessage);
        resolvedSuccessUrl = `${window.location.origin}/success?creatorId=${creatorId}`; // Fallback
      }

      if (!isValidUrl(resolvedCancelUrl)) {
        const errorMessage = `Invalid cancelUrl: ${resolvedCancelUrl}. Falling back to default.`;
        console.warn(errorMessage);
        onError?.(errorMessage);
        resolvedCancelUrl = `${window.location.origin}/cancel?creatorId=${creatorId}`; // Fallback
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: resolvedSuccessUrl,
        cancelUrl: resolvedCancelUrl,
        clientReferenceId: creatorId, // Optional: Useful for associating the session with a creator in Stripe.
      });

      if (stripeError) {
        const errorMessage = `Stripe checkout error: ${stripeError.message}`;
        setError(errorMessage);
        console.error("Stripe checkout error:", stripeError);
        onError?.(errorMessage);
      } else {
        onSuccess?.(); // Call onSuccess only if redirectToCheckout was successful (no immediate error)
      }
    } catch (err: any) {
      const errorMessage = `Failed to initiate checkout: ${err.message}`;
      setError(errorMessage);
      console.error("Checkout initiation error:", err);
      onError?.(errorMessage);
      onCancel?.(); // Consider calling onCancel if checkout initiation fails.
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [stripe, priceId, creatorId, successUrl, cancelUrl, onSuccess, onCancel, onError]);

  const isButtonDisabled = disabled || loading || !stripe;

  const buttonProps = {
    onClick: handleCheckout,
    disabled: isButtonDisabled,
    'aria-disabled': isButtonDisabled, // for accessibility
    className,
    style,
    id,
  };

  return (
    <div>
      {stripeLoadingError && (
        <div className="error" role="alert">
          Error: {stripeLoadingError}
        </div>
      )}

      {error && (
        <div className="error" role="alert">
          Error: {error}
        </div>
      )}

      <button {...buttonProps}>
        {loading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default StripeBilling;