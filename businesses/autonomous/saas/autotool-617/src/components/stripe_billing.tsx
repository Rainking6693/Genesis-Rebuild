// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscriptionStatus?customerId=${customerId}`); // Replace with your API endpoint
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
    }

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/stripe/createCheckoutSession', { // Replace with your API endpoint
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

      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId });

        if (result.error) {
          setError(result.error.message);
          console.error("Error redirecting to checkout:", result.error.message);
        }
      } else {
        setError("Stripe failed to load.");
        console.error("Stripe failed to load.");
      }
    } catch (e: any) {
      setError(`Failed to create checkout session: ${e.message}`);
      console.error("Error creating checkout session:", e);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancelSubscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh subscription status after cancellation
      setSubscriptionStatus("canceled");
    } catch (e: any) {
      setError(`Failed to cancel subscription: ${e.message}`);
      console.error("Error cancelling subscription:", e);
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
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>Your subscription is inactive.</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscriptionStatus?customerId=${customerId}`); // Replace with your API endpoint
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
    }

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/stripe/createCheckoutSession', { // Replace with your API endpoint
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

      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId });

        if (result.error) {
          setError(result.error.message);
          console.error("Error redirecting to checkout:", result.error.message);
        }
      } else {
        setError("Stripe failed to load.");
        console.error("Stripe failed to load.");
      }
    } catch (e: any) {
      setError(`Failed to create checkout session: ${e.message}`);
      console.error("Error creating checkout session:", e);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancelSubscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh subscription status after cancellation
      setSubscriptionStatus("canceled");
    } catch (e: any) {
      setError(`Failed to cancel subscription: ${e.message}`);
      console.error("Error cancelling subscription:", e);
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
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>Your subscription is inactive.</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
}