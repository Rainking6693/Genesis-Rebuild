import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  options?: Stripe.Options;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [loadingError, setLoadingError] = useState<Error | null>(null);

  const optionsMemo = useMemo(() => {
    if (!stripeKey) return undefined;
    return { ...options, apiKey: stripeKey };
  }, [stripeKey, options]);

  const createStripeInstance = useCallback(() => {
    if (!stripeKey) return;

    return new Stripe(stripeKey, optionsMemo);
  }, [stripeKey, optionsMemo]);

  useEffect(() => {
    const newStripe = createStripeInstance();

    if (!newStripe) {
      setLoadingError(new Error('Failed to create Stripe instance'));
      return;
    }

    setStripeInstance(newStripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      newStripe.close();
    };
  }, [createStripeInstance]);

  if (!stripeInstance) {
    return (
      <div data-testid="loading-stripe" role="alert">
        Loading Stripe...
      </div>
    );
  }

  if (loadingError) {
    return (
      <div data-testid="loading-error" role="alert">
        {loadingErrorMessage}
      </div>
    );
  }

  return (
    <Elements options={{ stripe: stripeInstance }} {...{ children }}>
      {children}
    </Elements>
  );

  function loadingErrorMessage() {
    if (!loadingError) return '';

    return loadingError.message || 'An unexpected error occurred.';
  }
};

export default MyComponent;

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  options?: Stripe.Options;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [loadingError, setLoadingError] = useState<Error | null>(null);

  const optionsMemo = useMemo(() => {
    if (!stripeKey) return undefined;
    return { ...options, apiKey: stripeKey };
  }, [stripeKey, options]);

  const createStripeInstance = useCallback(() => {
    if (!stripeKey) return;

    return new Stripe(stripeKey, optionsMemo);
  }, [stripeKey, optionsMemo]);

  useEffect(() => {
    const newStripe = createStripeInstance();

    if (!newStripe) {
      setLoadingError(new Error('Failed to create Stripe instance'));
      return;
    }

    setStripeInstance(newStripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      newStripe.close();
    };
  }, [createStripeInstance]);

  if (!stripeInstance) {
    return (
      <div data-testid="loading-stripe" role="alert">
        Loading Stripe...
      </div>
    );
  }

  if (loadingError) {
    return (
      <div data-testid="loading-error" role="alert">
        {loadingErrorMessage}
      </div>
    );
  }

  return (
    <Elements options={{ stripe: stripeInstance }} {...{ children }}>
      {children}
    </Elements>
  );

  function loadingErrorMessage() {
    if (!loadingError) return '';

    return loadingError.message || 'An unexpected error occurred.';
  }
};

export default MyComponent;