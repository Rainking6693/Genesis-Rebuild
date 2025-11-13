import React, { FC, useEffect, useState } from 'react';

interface Props {
  customerId: string; // Use a more descriptive name for the prop to align with the business context
  customerName?: string; // Make customerName optional
}

const MyComponent: FC<Props> = ({ customerId, customerName }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStripeAsync = async () => {
      try {
        const stripe = await loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace YOUR_STRIPE_PUBLISHABLE_KEY with your actual Stripe publishable key
        setStripe(stripe);
      } catch (error) {
        setError(error.message);
      }
    };

    if (!stripe) {
      loadStripeAsync();
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stripe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{customerName ? `Welcome back, ${customerName}!` : `Welcome, Customer ${customerId}!`}</h1>
      {/* Add a link to the customer's account or profile */}
      <a href={`/customer/${customerId}`}>View Account</a>
      {/* Add ARIA attributes for accessibility */}
      <a href={`/customer/${customerId}`} aria-label="View Customer's Account">View Account</a>
    </div>
  );
};

// Import Stripe API for billing
import { loadStripe } from '@stripe/stripe-js';

export { getStripe, MyComponent };

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace YOUR_STRIPE_PUBLISHABLE_KEY with your actual Stripe publishable key
  }
  return stripePromise;
};

This version of the component will display an error message if there's an issue loading Stripe, and it includes ARIA attributes for better accessibility. The code structure has also been improved for better maintainability.