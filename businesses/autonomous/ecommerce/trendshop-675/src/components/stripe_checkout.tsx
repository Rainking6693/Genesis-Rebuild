// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded.  If not, something is wrong with the key.
    if (!stripePromise) {
      setError("Stripe failed to load. Check your publishable key.");
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again later.");
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/create-stripe-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Payment failed: ${errorData.error || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setIsLoading(false);
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleClick} disabled={isLoading || error !== null}>
        {isLoading ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded.  If not, something is wrong with the key.
    if (!stripePromise) {
      setError("Stripe failed to load. Check your publishable key.");
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again later.");
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/create-stripe-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Payment failed: ${errorData.error || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setIsLoading(false);
      }
    } catch (e: any) {
      setError(`An unexpected error occurred: ${e.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleClick} disabled={isLoading || error !== null}>
        {isLoading ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;