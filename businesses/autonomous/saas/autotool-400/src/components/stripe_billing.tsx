// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (!stripeInstance) {
          throw new Error("Stripe failed to load.");
        }
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;
      try {
        // Simulate fetching subscription status from your backend
        // Replace with your actual API endpoint
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(`Failed to fetch subscription status: ${err.message}`);
      }
    };

    if (stripe && customerId) {
      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleCheckout = async () => {
    if (!stripe) return;
    try {
      // Simulate creating a checkout session on your backend
      // Replace with your actual API endpoint
      const response = await fetch('/api/checkout_sessions', {
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
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(`Failed to initiate checkout: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleCheckout} disabled={subscriptionStatus === 'active'}>
        {subscriptionStatus === 'active' ? 'Already Subscribed' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (!stripeInstance) {
          throw new Error("Stripe failed to load.");
        }
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;
      try {
        // Simulate fetching subscription status from your backend
        // Replace with your actual API endpoint
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(`Failed to fetch subscription status: ${err.message}`);
      }
    };

    if (stripe && customerId) {
      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleCheckout = async () => {
    if (!stripe) return;
    try {
      // Simulate creating a checkout session on your backend
      // Replace with your actual API endpoint
      const response = await fetch('/api/checkout_sessions', {
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
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(`Failed to initiate checkout: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleCheckout} disabled={subscriptionStatus === 'active'}>
        {subscriptionStatus === 'active' ? 'Already Subscribed' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default StripeBilling;