// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

interface SubscriptionData {
  status: string;
  priceId: string;
  // Add other relevant subscription data
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/stripe/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription data: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId]);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (stripe) {
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Stripe SDK failed to load.");
      }

    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend to cancel the subscription
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // Refresh subscription data after cancellation
      const data = await response.json();
      setSubscriptionData(data);

    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription.');
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
      <h2>Stripe Billing</h2>
      {subscriptionData ? (
        <div>
          <p>Subscription Status: {subscriptionData.status}</p>
          <p>Price ID: {subscriptionData.priceId}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={() => handleCheckout('price_123')}>Subscribe Now</button> {/* Replace with your actual price ID */}
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

interface SubscriptionData {
  status: string;
  priceId: string;
  // Add other relevant subscription data
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/stripe/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription data: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId]);

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (stripe) {
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Stripe SDK failed to load.");
      }

    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend to cancel the subscription
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // Refresh subscription data after cancellation
      const data = await response.json();
      setSubscriptionData(data);

    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription.');
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
      <h2>Stripe Billing</h2>
      {subscriptionData ? (
        <div>
          <p>Subscription Status: {subscriptionData.status}</p>
          <p>Price ID: {subscriptionData.priceId}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={() => handleCheckout('price_123')}>Subscribe Now</button> {/* Replace with your actual price ID */}
        </div>
      )}
    </div>
  );
};

export default StripeBilling;