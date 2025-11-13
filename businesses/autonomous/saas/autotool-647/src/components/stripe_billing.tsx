// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
}

const StripeBilling = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData>({ status: null, priceId: null });
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - replace with actual user authentication
  const userId = 'user123';

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate fetching subscription status from your backend
        const response = await fetch(`/api/subscription?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription({ status: data.status, priceId: data.priceId });
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [userId]);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setError(null);

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
        body: JSON.stringify({ priceId, userId }),
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
    } catch (e: any) {
      setError(e.message);
      console.error("Error during checkout:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend to create a Stripe Customer Portal Session
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portal session: ${response.status}`);
      }

      const { url } = await response.json();

      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
      console.error("Error creating portal session:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscription Status</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {subscription.status === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleManageSubscription} disabled={loading}>
            Manage Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={() => handleCheckout('price_12345')} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}

      {/* TODO: Add tests for all functions and components.  Focus on error handling and edge cases. */}
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
}

const StripeBilling = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData>({ status: null, priceId: null });
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - replace with actual user authentication
  const userId = 'user123';

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate fetching subscription status from your backend
        const response = await fetch(`/api/subscription?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription({ status: data.status, priceId: data.priceId });
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [userId]);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setError(null);

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
        body: JSON.stringify({ priceId, userId }),
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
    } catch (e: any) {
      setError(e.message);
      console.error("Error during checkout:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend to create a Stripe Customer Portal Session
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portal session: ${response.status}`);
      }

      const { url } = await response.json();

      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
      console.error("Error creating portal session:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscription Status</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {subscription.status === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleManageSubscription} disabled={loading}>
            Manage Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={() => handleCheckout('price_12345')} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}

      {/* TODO: Add tests for all functions and components.  Focus on error handling and edge cases. */}
    </div>
  );
};

export default StripeBilling;