// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (ideally from environment variables)
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
  currentPeriodEnd: number | null;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    priceId: null,
    currentPeriodEnd: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Retrieve the customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all', // Include all subscription statuses
          limit: 1, // Assuming one active subscription
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          setSubscriptionData({
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: subscription.current_period_end,
          });
        } else {
          // No subscription found
          setSubscriptionData({
            status: 'inactive',
            priceId: null,
            currentPeriodEnd: null,
          });
        }
      } catch (err: any) {
        console.error('Error fetching subscription data:', err);
        setError(`Failed to fetch subscription data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId]);

  const handleCancelSubscription = async () => {
    try {
      // Find the active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscriptionId = subscriptions.data[0].id;
        // Cancel the subscription
        await stripe.subscriptions.cancel(subscriptionId);
        // Update the state to reflect the cancellation
        setSubscriptionData((prev) => ({ ...prev, status: 'canceled' }));
        alert('Subscription canceled successfully!');
      } else {
        alert('No active subscription found to cancel.');
      }
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      alert(`Failed to cancel subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading subscription data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      <p>Customer ID: {customerId}</p>
      <p>Subscription Status: {subscriptionData.status || 'Not subscribed'}</p>
      {subscriptionData.status === 'active' && (
        <>
          <p>Price ID: {subscriptionData.priceId}</p>
          <p>Current Period End: {subscriptionData.currentPeriodEnd ? new Date(subscriptionData.currentPeriodEnd * 1000).toLocaleDateString() : 'N/A'}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </>
      )}
      {subscriptionData.status !== 'active' && (
        <p>No active subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (ideally from environment variables)
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
  currentPeriodEnd: number | null;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    priceId: null,
    currentPeriodEnd: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Retrieve the customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all', // Include all subscription statuses
          limit: 1, // Assuming one active subscription
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          setSubscriptionData({
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: subscription.current_period_end,
          });
        } else {
          // No subscription found
          setSubscriptionData({
            status: 'inactive',
            priceId: null,
            currentPeriodEnd: null,
          });
        }
      } catch (err: any) {
        console.error('Error fetching subscription data:', err);
        setError(`Failed to fetch subscription data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId]);

  const handleCancelSubscription = async () => {
    try {
      // Find the active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscriptionId = subscriptions.data[0].id;
        // Cancel the subscription
        await stripe.subscriptions.cancel(subscriptionId);
        // Update the state to reflect the cancellation
        setSubscriptionData((prev) => ({ ...prev, status: 'canceled' }));
        alert('Subscription canceled successfully!');
      } else {
        alert('No active subscription found to cancel.');
      }
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      alert(`Failed to cancel subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading subscription data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      <p>Customer ID: {customerId}</p>
      <p>Subscription Status: {subscriptionData.status || 'Not subscribed'}</p>
      {subscriptionData.status === 'active' && (
        <>
          <p>Price ID: {subscriptionData.priceId}</p>
          <p>Current Period End: {subscriptionData.currentPeriodEnd ? new Date(subscriptionData.currentPeriodEnd * 1000).toLocaleDateString() : 'N/A'}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </>
      )}
      {subscriptionData.status !== 'active' && (
        <p>No active subscription found.</p>
      )}
    </div>
  );
};

export default StripeBilling;