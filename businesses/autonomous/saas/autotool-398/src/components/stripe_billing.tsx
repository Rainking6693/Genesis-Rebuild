// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
  customerId: string | null;
}

interface StripeBillingProps {
  userId: string; // Assuming you have a user ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ userId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    priceId: null,
    customerId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Replace with your API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch subscription data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [userId]);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Call your backend to create the Stripe Checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: priceId, userId: userId }),
      });

      const data = await response.json();

      if (response.status === 500) {
        const error = await response.json();
        throw new Error(error.message);
      }

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(e.message);
      console.error("Checkout failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPortal = async () => {
    try {
      setLoading(true);
      // Call your backend to create the Stripe Customer Portal session
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: subscriptionData.customerId }),
      });

      const data = await response.json();

      if (response.status === 500) {
        const error = await response.json();
        throw new Error(error.message);
      }

      window.location.href = data.url;

    } catch (e: any) {
      setError(e.message);
      console.error("Customer Portal failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionData.status || 'Not Subscribed'}</h2>
      {subscriptionData.status !== 'active' && (
        <button onClick={() => handleCheckout('price_1Oxxxxxxxxxxxxxxxxxxxx')}>
          Subscribe Now
        </button>
      )}
      {subscriptionData.status === 'active' && (
        <button onClick={handleCustomerPortal}>
          Manage Subscription
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

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
  customerId: string | null;
}

interface StripeBillingProps {
  userId: string; // Assuming you have a user ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ userId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    priceId: null,
    customerId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Replace with your API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch subscription data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [userId]);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Call your backend to create the Stripe Checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: priceId, userId: userId }),
      });

      const data = await response.json();

      if (response.status === 500) {
        const error = await response.json();
        throw new Error(error.message);
      }

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(e.message);
      console.error("Checkout failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPortal = async () => {
    try {
      setLoading(true);
      // Call your backend to create the Stripe Customer Portal session
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: subscriptionData.customerId }),
      });

      const data = await response.json();

      if (response.status === 500) {
        const error = await response.json();
        throw new Error(error.message);
      }

      window.location.href = data.url;

    } catch (e: any) {
      setError(e.message);
      console.error("Customer Portal failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionData.status || 'Not Subscribed'}</h2>
      {subscriptionData.status !== 'active' && (
        <button onClick={() => handleCheckout('price_1Oxxxxxxxxxxxxxxxxxxxx')}>
          Subscribe Now
        </button>
      )}
      {subscriptionData.status === 'active' && (
        <button onClick={handleCustomerPortal}>
          Manage Subscription
        </button>
      )}
    </div>
  );
};

export default StripeBilling;