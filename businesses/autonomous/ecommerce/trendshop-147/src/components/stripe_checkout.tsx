// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeCheckoutProps {
  priceId: string; // Stripe Price ID
  successUrl: string; // URL to redirect to on success
  cancelUrl: string; // URL to redirect to on cancellation
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError('Stripe failed to load. Please check your Stripe key.');
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError('Stripe failed to initialize.');
        setLoading(false);
        return;
      }

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message || 'An error occurred during checkout.');
        }
      } else {
        setError(data.error || 'Failed to create checkout session.');
      }

    } catch (e: any) {
      console.error("Checkout Error:", e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button role="link" disabled={loading} onClick={handleClick}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeCheckoutProps {
  priceId: string; // Stripe Price ID
  successUrl: string; // URL to redirect to on success
  cancelUrl: string; // URL to redirect to on cancellation
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError('Stripe failed to load. Please check your Stripe key.');
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError('Stripe failed to initialize.');
        setLoading(false);
        return;
      }

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message || 'An error occurred during checkout.');
        }
      } else {
        setError(data.error || 'Failed to create checkout session.');
      }

    } catch (e: any) {
      console.error("Checkout Error:", e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button role="link" disabled={loading} onClick={handleClick}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;