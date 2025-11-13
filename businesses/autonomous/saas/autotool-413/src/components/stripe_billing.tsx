// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create Payment Intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const handleCheckout = async () => {
    if (!stripePromise || !clientSecret) {
      setError("Stripe is not initialized or client secret is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <button onClick={handleCheckout} disabled={!clientSecret}>
          Checkout with Stripe
        </button>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create Payment Intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const handleCheckout = async () => {
    if (!stripePromise || !clientSecret) {
      setError("Stripe is not initialized or client secret is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <button onClick={handleCheckout} disabled={!clientSecret}>
          Checkout with Stripe
        </button>
      )}
    </div>
  );
};

export default StripeBilling;