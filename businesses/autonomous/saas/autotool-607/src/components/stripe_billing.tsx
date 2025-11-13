// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface BillingProps {
  customerId: string;
}

interface Subscription {
  id: string;
  status: string;
  price: {
    unit_amount: number;
    currency: string;
  };
}

const StripeBilling: React.FC<BillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (!stripeInstance) {
          throw new Error("Stripe failed to load.");
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to load Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (stripe) {
      fetchSubscription();
    }
  }, [stripe, customerId]);

  const handleCheckout = async () => {
    if (!stripe) return;

    try {
      const response = await fetch('/api/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(`Checkout failed: ${err.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  return (
    <div>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <p>Price: {subscription.price.unit_amount / 100} {subscription.price.currency}</p>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={handleCheckout}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface BillingProps {
  customerId: string;
}

interface Subscription {
  id: string;
  status: string;
  price: {
    unit_amount: number;
    currency: string;
  };
}

const StripeBilling: React.FC<BillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (!stripeInstance) {
          throw new Error("Stripe failed to load.");
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to load Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!stripe) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(`Failed to fetch subscription: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (stripe) {
      fetchSubscription();
    }
  }, [stripe, customerId]);

  const handleCheckout = async () => {
    if (!stripe) return;

    try {
      const response = await fetch('/api/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(`Checkout failed: ${err.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  return (
    <div>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <p>Price: {subscription.price.unit_amount / 100} {subscription.price.currency}</p>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={handleCheckout}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;