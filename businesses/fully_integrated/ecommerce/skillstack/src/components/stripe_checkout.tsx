import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StripeProvider, Elements, ElementsProps, LoadingElement, ErrorElement } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have a LoadingSpinner component

interface Props extends ElementsProps {
  stripePublishableKey: string;
  customerId: string;
  subscriptionId: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ stripePublishableKey, customerId, subscriptionId, message, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);

  const handleLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) {
      loadingSpinnerRef.current?.focus();
    }
  }, []);

  const handleError = (err: Error) => {
    setError(err);
  };

  useEffect(() => {
    if (!stripePublishableKey) {
      throw new Error('Stripe publishable key is not set');
    }

    if (!customerId || !subscriptionId) {
      throw new Error('customerId and subscriptionId are required');
    }

    return () => {
      setError(null);
    };
  }, [stripePublishableKey, customerId, subscriptionId]);

  useEffect(() => {
    if (!loading) {
      if (loadingSpinnerRef.current) {
        loadingSpinnerRef.current.blur();
      }
    }
  }, [loading]);

  return (
    <StripeProvider apiKey={stripePublishableKey}>
      <Elements {...rest} options={{ loading: handleLoading, error: handleError }}>
        <LoadingElement as={<LoadingSpinner ref={loadingSpinnerRef} aria-label="Loading" />} />
        <ErrorElement as={<div role="alert" aria-live="polite">{error?.message || 'An error occurred. Please try again.'}</div>} />
        <CheckoutForm customerId={customerId} subscriptionId={subscriptionId} />
      </Elements>
      <div>{message}</div>
    </StripeProvider>
  );
};

export default FunctionalComponent;

This updated code addresses the initial concerns and adds additional improvements to make the component more resilient, accessible, and maintainable. You may need to adjust the code to fit your specific use case and handle additional edge cases as needed.