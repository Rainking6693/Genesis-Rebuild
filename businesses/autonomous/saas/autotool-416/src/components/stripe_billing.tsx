// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null); // e.g., "active", "canceled"

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance) {
          setStripe(stripeInstance);
          setLoading(false);
        } else {
          throw new Error("Failed to initialize Stripe.");
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const createSubscription = async (priceId: string) => {
    if (!stripe) {
      setError("Stripe not initialized.");
      return;
    }

    try {
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: priceId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(`Subscription creation failed: ${data.error}`);
      } else if (data.subscriptionId) {
        // Redirect user to Stripe to complete the payment
        stripe.redirectToCheckout({ sessionId: data.subscriptionId });
      }
    } catch (err: any) {
      setError(`Error creating subscription: ${err.message}`);
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/cancel-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(`Subscription cancellation failed: ${data.error}`);
      } else {
        setSubscriptionStatus("canceled"); // Update state accordingly
      }
    } catch (err: any) {
      setError(`Error cancelling subscription: ${err.message}`);
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
      <h2>Stripe Billing</h2>
      {subscriptionStatus === "active" ? (
        <button onClick={cancelSubscription}>Cancel Subscription</button>
      ) : (
        <button onClick={() => createSubscription("price_12345")}>Subscribe</button> // Replace with a real price ID
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null); // e.g., "active", "canceled"

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance) {
          setStripe(stripeInstance);
          setLoading(false);
        } else {
          throw new Error("Failed to initialize Stripe.");
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const createSubscription = async (priceId: string) => {
    if (!stripe) {
      setError("Stripe not initialized.");
      return;
    }

    try {
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: priceId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(`Subscription creation failed: ${data.error}`);
      } else if (data.subscriptionId) {
        // Redirect user to Stripe to complete the payment
        stripe.redirectToCheckout({ sessionId: data.subscriptionId });
      }
    } catch (err: any) {
      setError(`Error creating subscription: ${err.message}`);
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/cancel-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(`Subscription cancellation failed: ${data.error}`);
      } else {
        setSubscriptionStatus("canceled"); // Update state accordingly
      }
    } catch (err: any) {
      setError(`Error cancelling subscription: ${err.message}`);
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
      <h2>Stripe Billing</h2>
      {subscriptionStatus === "active" ? (
        <button onClick={cancelSubscription}>Cancel Subscription</button>
      ) : (
        <button onClick={() => createSubscription("price_12345")}>Subscribe</button> // Replace with a real price ID
      )}
    </div>
  );
};

export default StripeBilling;