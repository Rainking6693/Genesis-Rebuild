import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey?: string;
  message?: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ stripeKey, elements, message, fallbackMessage }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      throw new Error('Stripe key is required');
    }

    let stripe: Stripe | null = null;
    try {
      stripe = new Stripe(stripeKey);
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      setStripeInstance(null);
      return;
    }

    setStripeInstance(stripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      if (stripe) stripe.close();
    };
  }, [stripeKey]);

  if (!stripeInstance) {
    return <div>{fallbackMessage || 'An error occurred while initializing Stripe'}</div>;
  }

  return (
    <div>
      {message}
      <Elements stripe={stripeInstance}>{elements}</Elements>
    </div>
  );
};

export default MyComponent;

1. Added a default value for `stripeKey` in the props interface to allow for optional props.
2. Added a `fallbackMessage` prop to provide a custom error message when the Stripe key is missing or an error occurs during initialization.
3. Wrapped the Stripe initialization in a try-catch block to handle potential errors and set `stripeInstance` to null if an error occurs.
4. Checked if `stripe` is not null before calling `stripe.close()` when the component unmounts to avoid errors.
5. Added accessibility by providing a fallback message when Stripe is not initialized.