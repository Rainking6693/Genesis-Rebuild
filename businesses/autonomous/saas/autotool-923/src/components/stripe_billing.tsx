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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      // Replace with your API endpoint to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message);
        }
      } else {
        setError("Stripe failed to load.");
      }
    } catch (e: any) {
      setError(e.message);
      console.error("Error creating checkout session:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Stripe Billing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {subscriptionStatus && <div>Subscription Status: {subscriptionStatus}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;