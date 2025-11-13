import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, LoadingElement, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeApiKey: string;
  options?: Stripe.Checkout.Options;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeApiKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      const stripe = await Stripe(stripeApiKey);
      setStripeInstance(stripe);
      setIsLoading(false);
    };

    if (!stripeInstance) {
      initStripe();
    }
  }, [stripeApiKey]);

  if (isLoading) {
    return <LoadingElement />;
  }

  if (!stripeInstance) {
    return <div>Error: Stripe instance not ready</div>;
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
import { Elements, LoadingElement, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeApiKey: string;
  options?: Stripe.Checkout.Options;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeApiKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      const stripe = await Stripe(stripeApiKey);
      setStripeInstance(stripe);
      setIsLoading(false);
    };

    if (!stripeInstance) {
      initStripe();
    }
  }, [stripeApiKey]);

  if (isLoading) {
    return <LoadingElement />;
  }

  if (!stripeInstance) {
    return <div>Error: Stripe instance not ready</div>;
  }

  return (
    <Elements stripe={stripeInstance} options={options}>
      {children}
    </Elements>
  );
};

export default MyComponent;