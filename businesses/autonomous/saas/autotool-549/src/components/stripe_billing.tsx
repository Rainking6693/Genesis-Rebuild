// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptionStatus?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(`Subscription failed: ${e.message}`);
      console.error("Error during subscription:", e);
    }
  };

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      {subscriptionStatus === 'inactive' && (
        <button onClick={handleSubscribe}>Subscribe</button>
      )}
    </div>
  );
}

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptionStatus?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(`Subscription failed: ${e.message}`);
      console.error("Error during subscription:", e);
    }
  };

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      {subscriptionStatus === 'inactive' && (
        <button onClick={handleSubscribe}>Subscribe</button>
      )}
    </div>
  );
}

export default StripeBilling;