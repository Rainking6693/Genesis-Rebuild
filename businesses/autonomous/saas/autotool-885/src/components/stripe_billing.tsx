// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface BillingProps {
  customerId: string; // Stripe Customer ID
}

const StripeBilling: React.FC<BillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-payment-intent', { // Assuming you have an API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create Payment Intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Error fetching client secret:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!clientSecret) {
    return <div>Unable to initialize billing. Please try again later.</div>;
  }

  return (
    <div className="stripe-billing">
      {/* Stripe Elements UI will be rendered here */}
      {/*  Consider using @stripe/react-stripe-js for a more robust integration */}
      {/*  Example:
           <Elements stripe={stripePromise} options={options}>
             <CheckoutForm />
           </Elements>
      */}
      <p>This component requires integration with Stripe Elements using `@stripe/react-stripe-js`.</p>
      <p>You'll need to create a `CheckoutForm` component and handle the payment process there.</p>
      <p>Refer to the Stripe documentation for detailed instructions.</p>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface BillingProps {
  customerId: string; // Stripe Customer ID
}

const StripeBilling: React.FC<BillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-payment-intent', { // Assuming you have an API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create Payment Intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Error fetching client secret:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!clientSecret) {
    return <div>Unable to initialize billing. Please try again later.</div>;
  }

  return (
    <div className="stripe-billing">
      {/* Stripe Elements UI will be rendered here */}
      {/*  Consider using @stripe/react-stripe-js for a more robust integration */}
      {/*  Example:
           <Elements stripe={stripePromise} options={options}>
             <CheckoutForm />
           </Elements>
      */}
      <p>This component requires integration with Stripe Elements using `@stripe/react-stripe-js`.</p>
      <p>You'll need to create a `CheckoutForm` component and handle the payment process there.</p>
      <p>Refer to the Stripe documentation for detailed instructions.</p>
    </div>
  );
};

export default StripeBilling;