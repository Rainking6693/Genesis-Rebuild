import React, { useEffect, useState } from 'react';
import { StripeCheckoutSession, LoaderFunctionArgs } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  productId: string;
  amount: number;
  currency: string;
  carbonCredits: number;
  customerEmail: string;
}

const MyComponent: React.FC<Props> = ({ productId, amount, currency, carbonCredits, customerEmail }) => {
  const [stripe, setStripe] = useState<StripeCheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripeAsync = async () => {
      try {
        const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        setStripe(stripePromise);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (!isLoading) return;

    loadStripeAsync();
  }, [isLoading]);

  const createCheckoutSession = async () => {
    if (!stripe) {
      setError(new Error('Stripe instance not loaded'));
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount,
          currency,
          carbonCredits,
          customerEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const checkoutSession = await response.json();
      if (stripe) stripe.redirectToCheckout({ sessionId: checkoutSession.id });
    } catch (error) {
      setError(error);
    }
  };

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={createCheckoutSession} aria-label="Purchase">
        Purchase
      </button>
    </div>
  );
};

export default MyComponent;

In this version, I've added state variables for loading and error states, and I've used the `useEffect` hook to handle the loading of the Stripe library. I've also added error handling for the loading of the Stripe library, creating the checkout session, and any other potential errors that might occur. Additionally, I've added a retry button for when an error occurs.