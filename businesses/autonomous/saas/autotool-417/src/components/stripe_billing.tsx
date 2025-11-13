// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeBilling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key not found in environment variables.");
    }
  }, []);

  const createCheckoutSession = async (subscriptionData: SubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message);
        }
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("An unexpected error occurred.");
      }

    } catch (e: any) {
      setError(e.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    const subscriptionData: SubscriptionData = {
      priceId: 'price_1Oxxxxxxxxxxxxxxxxxxxxx', // Replace with your actual price ID
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    };

    await createCheckoutSession(subscriptionData);
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleSubscription} disabled={loading}>
          Subscribe Now
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
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeBilling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key not found in environment variables.");
    }
  }, []);

  const createCheckoutSession = async (subscriptionData: SubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message);
        }
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("An unexpected error occurred.");
      }

    } catch (e: any) {
      setError(e.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    const subscriptionData: SubscriptionData = {
      priceId: 'price_1Oxxxxxxxxxxxxxxxxxxxxx', // Replace with your actual price ID
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    };

    await createCheckoutSession(subscriptionData);
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleSubscription} disabled={loading}>
          Subscribe Now
        </button>
      )}
    </div>
  );
};

export default StripeBilling;