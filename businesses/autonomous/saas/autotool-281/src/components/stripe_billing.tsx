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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const handleCheckout = async () => {
    if (!stripe) {
      setError('Stripe has not initialized yet.');
      return;
    }

    try {
      // Create a checkout session on the server
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(`Error creating checkout session: ${err.message}`);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
      const data = await response.json();
      setSubscriptionStatus(data.status);
    } catch (err: any) {
      setError(`Error fetching subscription status: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [customerId]);

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing</h2>
      {subscriptionStatus ? (
        <p>Subscription Status: {subscriptionStatus}</p>
      ) : (
        <button onClick={handleCheckout}>Subscribe</button>
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const handleCheckout = async () => {
    if (!stripe) {
      setError('Stripe has not initialized yet.');
      return;
    }

    try {
      // Create a checkout session on the server
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(`Error creating checkout session: ${err.message}`);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
      const data = await response.json();
      setSubscriptionStatus(data.status);
    } catch (err: any) {
      setError(`Error fetching subscription status: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [customerId]);

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing</h2>
      {subscriptionStatus ? (
        <p>Subscription Status: {subscriptionStatus}</p>
      ) : (
        <button onClick={handleCheckout}>Subscribe</button>
      )}
    </div>
  );
};

export default StripeBilling;