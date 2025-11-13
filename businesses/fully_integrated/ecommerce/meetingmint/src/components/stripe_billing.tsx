import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';
import { useId } from '@reach/auto-id';

interface Props extends ElementsProps {
  stripeKey: string;
  options?: any;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const loadingId = useId();

  useEffect(() => {
    if (!stripeKey) return;

    const newStripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27', // Set the API version for better compatibility
    });

    setStripeInstance(newStripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      newStripe.close();
    };
  }, [stripeKey]);

  if (!stripeInstance) {
    return (
      <div id={loadingId} aria-live="polite">
        Loading Stripe...
      </div>
    );
  }

  return (
    <Elements stripe={stripeInstance} options={options}>
      {children}
    </Elements>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';
import { useId } from '@reach/auto-id';

interface Props extends ElementsProps {
  stripeKey: string;
  options?: any;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const loadingId = useId();

  useEffect(() => {
    if (!stripeKey) return;

    const newStripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27', // Set the API version for better compatibility
    });

    setStripeInstance(newStripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      newStripe.close();
    };
  }, [stripeKey]);

  if (!stripeInstance) {
    return (
      <div id={loadingId} aria-live="polite">
        Loading Stripe...
      </div>
    );
  }

  return (
    <Elements stripe={stripeInstance} options={options}>
      {children}
    </Elements>
  );
};

export default MyComponent;