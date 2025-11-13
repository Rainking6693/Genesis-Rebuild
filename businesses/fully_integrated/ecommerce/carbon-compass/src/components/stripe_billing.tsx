import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeApiKey: string;
  options?: Stripe.ElementsOptions;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeApiKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stripeApiKey) {
      throw new Error('Missing stripeApiKey');
    }

    const stripe = new Stripe(stripeApiKey, {
      apiVersion: '2020-08-27', // Use a specific API version
      // Add any additional Stripe.js options here
    });

    stripe.on('error', (err) => {
      console.error('Stripe error:', err);
      setError(err);
    });

    setStripeInstance(stripe);

    // Clean up the Stripe instance when the component unmounts
    return () => {
      stripe.close();
    };
  }, [stripeApiKey]);

  if (!stripeInstance) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred while initializing Stripe:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripeInstance}>
      {children}
    </Elements>
  );
};

MyComponent.defaultProps = {
  options: {},
};

export default MyComponent;

This version of the component checks if the `stripeApiKey` is provided, initializes Stripe with error handling, and provides an error message if an error occurs during initialization. It also adds ARIA labels for accessibility.