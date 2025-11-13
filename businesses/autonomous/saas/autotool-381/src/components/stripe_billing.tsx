// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null); // Replace 'any' with a proper type

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe || !customerId) return;

      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.statusText}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      }
    };

    fetchSubscription();
  }, [stripe, customerId]);

  const handleCreateSubscription = async (priceId: string) => {
    if (!stripe || !customerId) return;

    try {
      // Replace with your actual API endpoint to create a subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, priceId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.statusText}`);
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: any) {
      setError(`Failed to create subscription: ${err.message}`);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !subscription.id) return;

    try {
      // Replace with your actual API endpoint to cancel a subscription
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.statusText}`);
      }

      setSubscription(null); // Clear the subscription state
    } catch (err: any) {
      setError(`Failed to cancel subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription.</p>
          <button onClick={() => handleCreateSubscription('price_123')}>Subscribe</button> {/* Replace with your actual price ID */}
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null); // Replace 'any' with a proper type

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe || !customerId) return;

      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.statusText}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      }
    };

    fetchSubscription();
  }, [stripe, customerId]);

  const handleCreateSubscription = async (priceId: string) => {
    if (!stripe || !customerId) return;

    try {
      // Replace with your actual API endpoint to create a subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, priceId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.statusText}`);
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err: any) {
      setError(`Failed to create subscription: ${err.message}`);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !subscription.id) return;

    try {
      // Replace with your actual API endpoint to cancel a subscription
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.statusText}`);
      }

      setSubscription(null); // Clear the subscription state
    } catch (err: any) {
      setError(`Failed to cancel subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription.</p>
          <button onClick={() => handleCreateSubscription('price_123')}>Subscribe</button> {/* Replace with your actual price ID */}
        </div>
      )}
    </div>
  );
};

export default StripeBilling;