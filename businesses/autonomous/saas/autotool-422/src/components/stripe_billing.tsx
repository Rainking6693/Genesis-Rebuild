// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        setError(`Error fetching subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const data = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          throw new Error(`Stripe checkout error: ${result.error.message}`);
        }
      } else {
        throw new Error("Stripe not initialized properly.");
      }

    } catch (e: any) {
      setError(`Error during checkout: ${e.message}`);
      console.error("Error during checkout:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}
      {subscriptionStatus && <div>Subscription Status: {subscriptionStatus}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe'}
      </button>
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
  customerId: string; // Assuming you have a customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        setError(`Error fetching subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const data = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          throw new Error(`Stripe checkout error: ${result.error.message}`);
        }
      } else {
        throw new Error("Stripe not initialized properly.");
      }

    } catch (e: any) {
      setError(`Error during checkout: ${e.message}`);
      console.error("Error during checkout:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}
      {subscriptionStatus && <div>Subscription Status: {subscriptionStatus}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;