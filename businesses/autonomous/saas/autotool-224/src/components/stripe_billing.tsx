// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use a specific API version
        });

        const subscriptionList = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.plan.product'],
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching subscriptions:", err);
        setError(err.message || "Failed to fetch subscriptions.");
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });

      await stripe.subscriptions.cancel(subscriptionId);
      // Optimistically update the UI
      setSubscriptions(prevSubscriptions =>
        prevSubscriptions.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'canceled' } : sub
        )
      );
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message || "Failed to cancel subscription.");
    }
  };

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              {/* Display subscription details, including plan name and status */}
              Plan: { (subscription.plan?.product as Stripe.Product)?.name || 'Unknown Plan'} - Status: {subscription.status}
              <button onClick={() => handleCancelSubscription(subscription.id)} disabled={subscription.status === 'canceled'}>
                {subscription.status === 'canceled' ? 'Canceled' : 'Cancel Subscription'}
              </button>
            </li>
          ))}
        </ul>
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
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use a specific API version
        });

        const subscriptionList = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.plan.product'],
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching subscriptions:", err);
        setError(err.message || "Failed to fetch subscriptions.");
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });

      await stripe.subscriptions.cancel(subscriptionId);
      // Optimistically update the UI
      setSubscriptions(prevSubscriptions =>
        prevSubscriptions.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'canceled' } : sub
        )
      );
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message || "Failed to cancel subscription.");
    }
  };

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              {/* Display subscription details, including plan name and status */}
              Plan: { (subscription.plan?.product as Stripe.Product)?.name || 'Unknown Plan'} - Status: {subscription.status}
              <button onClick={() => handleCancelSubscription(subscription.id)} disabled={subscription.status === 'canceled'}>
                {subscription.status === 'canceled' ? 'Canceled' : 'Cancel Subscription'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StripeBilling;