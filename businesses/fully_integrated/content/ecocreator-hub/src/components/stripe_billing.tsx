import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey?: string; // Added optional stripeKey to handle missing API key
  message?: string; // Added optional message to handle missing message
}

const FunctionalComponent: FC<Props> = ({ stripeKey, message, ...elementsProps }) => {
  const [client, setClient] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      console.warn('Missing Stripe API key. Using a test key for development.');
      const testKey = 'your_test_stripe_key'; // Add a test key for development
      const stripe = new Stripe(testKey);
      setClient(stripe);
    } else {
      const stripe = new Stripe(stripeKey);
      setClient(stripe);
    }
  }, [stripeKey]);

  if (!client) {
    return <div>Initializing Stripe...</div>; // Provide a loading message
  }

  return (
    <Elements {...elementsProps} stripe={client}>
      {message && <div>{message}</div>}
    </Elements>
  );
};

export default FunctionalComponent;

In this updated code:

1. I've made `stripeKey` and `message` optional to handle edge cases where they might not be provided.
2. I've added a test key for development in case the production key is missing.
3. I've provided a loading message when initializing Stripe.
4. I've removed the error messages as they are not user-friendly and can be replaced with more informative messages or loading indicators.
5. I've used TypeScript's optional properties and conditional statements to make the code more maintainable.