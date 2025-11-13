// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscription, setSubscription] = useState<any>(null); // Replace 'any' with a proper type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe || !customerId) return;

      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [stripe, customerId]);

  const handleCreateSubscription = async () => {
    if (!stripe) return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint to create a subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Redirect the user to Stripe to complete the payment
      stripe.redirectToCheckout({ sessionId: data.sessionId });

    } catch (err: any) {
      setError(`Failed to create subscription: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          {/* Add more subscription details here */}
        </div>
      ) : (
        <button onClick={handleCreateSubscription}>Create Subscription</button>
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
  const [subscription, setSubscription] = useState<any>(null); // Replace 'any' with a proper type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe || !customerId) return;

      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [stripe, customerId]);

  const handleCreateSubscription = async () => {
    if (!stripe) return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint to create a subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Redirect the user to Stripe to complete the payment
      stripe.redirectToCheckout({ sessionId: data.sessionId });

    } catch (err: any) {
      setError(`Failed to create subscription: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          {/* Add more subscription details here */}
        </div>
      ) : (
        <button onClick={handleCreateSubscription}>Create Subscription</button>
      )}
    </div>
  );
};

export default StripeBilling;