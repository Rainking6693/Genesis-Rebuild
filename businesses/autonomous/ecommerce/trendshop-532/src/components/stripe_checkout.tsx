// src/components/stripe_checkout.tsx
import React, { useState, useEffect } from 'react';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs once when the component mounts.
    // We're using it to check if Stripe is available.
    if (typeof window !== 'undefined' && typeof window.Stripe === 'undefined') {
      console.warn("Stripe.js hasn't loaded yet. Ensure it's included in your HTML.");
      setError("Stripe.js hasn't loaded yet. Please check your integration.");
    }
  }, []);

  const redirectToCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      if (typeof window !== 'undefined' && typeof window.Stripe !== 'undefined') {
        const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual public key
        stripe?.redirectToCheckout({ sessionId });
      } else {
        console.error("Stripe.js not loaded.  Cannot redirect to checkout.");
        setError("Stripe.js not loaded.  Cannot redirect to checkout.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={redirectToCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/stripe_checkout.tsx
import React, { useState, useEffect } from 'react';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs once when the component mounts.
    // We're using it to check if Stripe is available.
    if (typeof window !== 'undefined' && typeof window.Stripe === 'undefined') {
      console.warn("Stripe.js hasn't loaded yet. Ensure it's included in your HTML.");
      setError("Stripe.js hasn't loaded yet. Please check your integration.");
    }
  }, []);

  const redirectToCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      if (typeof window !== 'undefined' && typeof window.Stripe !== 'undefined') {
        const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual public key
        stripe?.redirectToCheckout({ sessionId });
      } else {
        console.error("Stripe.js not loaded.  Cannot redirect to checkout.");
        setError("Stripe.js not loaded.  Cannot redirect to checkout.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={redirectToCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to write these files.