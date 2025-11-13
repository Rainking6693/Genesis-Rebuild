import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { Subscription } from '@stripe/stripe-billing-api';

interface Props {
  stripeKey: string;
  options?: any;
  children: React.ReactNode;
}

interface SubscriptionProps {
  customerId: string;
  planId: string;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const stripeApiKey = process.env.REACT_APP_STRIPE_KEY;

  useEffect(() => {
    if (!stripeApiKey) {
      throw new Error('Missing Stripe API key');
    }

    const newStripe = new Stripe(stripeApiKey, {
      apiVersion: '2020-07-12',
    });

    setStripe(newStripe);
    setLoading(false);
  }, [stripeApiKey]);

  const stripeInstance = useStripe();
  const elements = useElements();

  if (!stripe || !stripeInstance || !elements || loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Elements stripe={stripeInstance} options={options}>
      {children}
    </Elements>
  );
};

const createSubscription = async (props: SubscriptionProps): Promise<Subscription | null> => {
  if (!stripe) return null;

  try {
    const subscription = await stripe.billingPortal.subscriptions.create({
      customer: props.customerId,
      items: [{ plan: props.planId }],
    });

    return subscription;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default MyComponent;
export { createSubscription };

In this version, I've added a loading state for the component, used a class `loading` for better accessibility, and moved the subscription creation function outside the component for better reusability. The subscription creation function now returns a promise and null in case of an error.