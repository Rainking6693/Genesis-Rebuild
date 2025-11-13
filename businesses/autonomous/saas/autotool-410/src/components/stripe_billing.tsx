// src/components/stripe_billing.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate fetching subscription status from your backend
        // In a real application, you would make an API call to your server
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming your API returns a 'status' field
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Simulate creating a checkout session on your backend
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

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("No session ID returned from server.");
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      // Simulate cancelling the subscription on your backend
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update subscription status after successful cancellation
      setSubscriptionStatus('inactive');

    } catch (e: any) {
      setError(`Cancellation failed: ${e.message}`);
      console.error("Error during cancellation:", e);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      {subscriptionStatus === 'active' && (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      )}

      {subscriptionStatus !== 'active' && (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={handleSubscribe} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
}

export default StripeBilling;

// src/components/stripe_billing.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate fetching subscription status from your backend
        // In a real application, you would make an API call to your server
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming your API returns a 'status' field
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Simulate creating a checkout session on your backend
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

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("No session ID returned from server.");
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      // Simulate cancelling the subscription on your backend
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update subscription status after successful cancellation
      setSubscriptionStatus('inactive');

    } catch (e: any) {
      setError(`Cancellation failed: ${e.message}`);
      console.error("Error during cancellation:", e);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      {subscriptionStatus === 'active' && (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      )}

      {subscriptionStatus !== 'active' && (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={handleSubscribe} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
}

export default StripeBilling;