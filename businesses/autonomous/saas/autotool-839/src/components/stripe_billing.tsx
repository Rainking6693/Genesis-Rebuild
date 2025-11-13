// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Subscription {
  id: string;
  status: string;
  price: {
    unit_amount: number;
    currency: string;
  };
}

interface CustomerPortalSession {
  url: string;
}

const StripeBilling = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/stripe/subscription'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to create customer portal session: ${response.status}`);
      }
      const data: CustomerPortalSession = await response.json();
      window.location.href = data.url; // Redirect to Stripe Customer Portal
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating customer portal session:", err);
    }
  };

  if (loading) {
    return <div>Loading subscription information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Details</h2>
      {subscription ? (
        <>
          <p>Status: {subscription.status}</p>
          <p>Price: {subscription.price.unit_amount / 100} {subscription.price.currency}</p>
          <button onClick={handleManageSubscription}>Manage Subscription</button>
        </>
      ) : (
        <p>No active subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Subscription {
  id: string;
  status: string;
  price: {
    unit_amount: number;
    currency: string;
  };
}

interface CustomerPortalSession {
  url: string;
}

const StripeBilling = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/stripe/subscription'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to create customer portal session: ${response.status}`);
      }
      const data: CustomerPortalSession = await response.json();
      window.location.href = data.url; // Redirect to Stripe Customer Portal
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating customer portal session:", err);
    }
  };

  if (loading) {
    return <div>Loading subscription information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Details</h2>
      {subscription ? (
        <>
          <p>Status: {subscription.status}</p>
          <p>Price: {subscription.price.unit_amount / 100} {subscription.price.currency}</p>
          <button onClick={handleManageSubscription}>Manage Subscription</button>
        </>
      ) : (
        <p>No active subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;