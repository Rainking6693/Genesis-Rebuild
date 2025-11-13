// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

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
        // Simulate fetching subscription status from your backend
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching subscription status:", err);
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
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Call your backend to create a Stripe Checkout Session
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

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus || 'Not Active'}</h2>
      <button onClick={handleCheckout} disabled={loading}>
        {subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

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
        // Simulate fetching subscription status from your backend
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching subscription status:", err);
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
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Call your backend to create a Stripe Checkout Session
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

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus || 'Not Active'}</h2>
      <button onClick={handleCheckout} disabled={loading}>
        {subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default StripeBilling;