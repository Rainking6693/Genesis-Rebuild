// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Specify API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      setError(`Error initializing Stripe: ${e.message}`);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      if (!stripe) return;

      try {
        // Simulate fetching subscription data from your backend
        // In a real application, you would make an API call to your server
        // which would then use the Stripe API to retrieve the subscription.
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (e: any) {
        setError(`Error fetching subscription: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [stripeApiKey, customerId, stripe]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) return;

    try {
      // Simulate creating a checkout session on your backend
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with your desired price ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (e: any) {
      setError(`Error upgrading subscription: ${e.message}`);
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
          <p>Current Plan: {subscription.plan}</p>
          <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
        </>
      ) : (
        <p>No subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Specify API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      setError(`Error initializing Stripe: ${e.message}`);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      if (!stripe) return;

      try {
        // Simulate fetching subscription data from your backend
        // In a real application, you would make an API call to your server
        // which would then use the Stripe API to retrieve the subscription.
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (e: any) {
        setError(`Error fetching subscription: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [stripeApiKey, customerId, stripe]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) return;

    try {
      // Simulate creating a checkout session on your backend
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with your desired price ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (e: any) {
      setError(`Error upgrading subscription: ${e.message}`);
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
          <p>Current Plan: {subscription.plan}</p>
          <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
        </>
      ) : (
        <p>No subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;