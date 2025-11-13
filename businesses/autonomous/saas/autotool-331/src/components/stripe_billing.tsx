// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await fetch('/api/stripe/subscription-status', {
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

        setSubscriptionStatus(data.status);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (e: any) {
        console.error("Failed to fetch subscription status:", e);
        setSubscriptionStatus('error');
        setError(e.message || "Failed to fetch subscription status.");
      }
    }

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret!, // Ensure clientSecret is not null
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (e: any) {
      console.error("Checkout failed:", e);
      setError(e.message || "Checkout failed.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
        </div>
      ) : (
        <div>
          <p>Your subscription is inactive.</p>
          <button onClick={handleCheckout} disabled={!clientSecret}>
            Subscribe Now
          </button>
          {!clientSecret && <p>Loading checkout...</p>}
        </div>
      )}
    </div>
  );
}