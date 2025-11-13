import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if the Stripe object is loaded
    if (!stripe) {
      // Set an error message and return early if Stripe is not loaded
      setError('Stripe.js has not been loaded correctly.');
      return;
    }

    // Set stripe as loaded once it's ready
    setStripeLoaded(true);
  }, []);

  useEffect(() => {
    // Check if the Stripe object is loaded before making any API calls
    if (!stripeLoaded) return;

    // Your handleBilling function here
  }, [stripeLoaded]);

  const handleBilling = async (amount: number, currency: string) => {
    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency,
      });

      // Redirect to checkout or handle payment intent client-side
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <div
        dangerouslySetInnerHTML={{ __html: message }}
        aria-label={message} // Add aria-label for accessibility
      />
      {stripeLoaded && (
        <button onClick={() => handleBilling(1000, 'usd')}>Billing</button>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

In this updated code, I've added a separate state variable `stripeLoaded` to track whether the Stripe object is loaded or not. I've also separated the check for the Stripe object's loading state into two separate `useEffect` hooks for better maintainability. The first hook sets the `stripeLoaded` state when the Stripe object is loaded, and the second hook checks the `stripeLoaded` state before making any API calls. This ensures that the `handleBilling` function is only called when the Stripe object is ready.