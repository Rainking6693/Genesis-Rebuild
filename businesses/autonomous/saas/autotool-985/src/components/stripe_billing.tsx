// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      setError(`Failed to initialize Stripe: ${e.message}`);
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      if (!stripe) return;

      try {
        const response = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.default_payment_method'],
        });
        setSubscriptions(response.data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch subscriptions: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId, stripe]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!stripe) return;

    try {
      setLoading(true);
      await stripe.subscriptions.cancel(subscriptionId);
      // Refresh subscriptions after cancellation
      const response = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
      setSubscriptions(response.data);
      setLoading(false);
    } catch (e: any) {
      setError(`Failed to cancel subscription: ${e.message}`);
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No active subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id} <br />
              Status: {subscription.status} <br />
              Price: {(subscription.plan?.amount || 0) / 100} {subscription.plan?.currency?.toUpperCase()} / {subscription.plan?.interval} <br />
              Payment Method: {subscription.default_payment_method ? (subscription.default_payment_method as Stripe.PaymentMethod).type : 'N/A'}
              <button onClick={() => handleCancelSubscription(subscription.id)}>Cancel Subscription</button>
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
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      setError(`Failed to initialize Stripe: ${e.message}`);
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      if (!stripe) return;

      try {
        const response = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.default_payment_method'],
        });
        setSubscriptions(response.data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch subscriptions: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId, stripe]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!stripe) return;

    try {
      setLoading(true);
      await stripe.subscriptions.cancel(subscriptionId);
      // Refresh subscriptions after cancellation
      const response = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
      setSubscriptions(response.data);
      setLoading(false);
    } catch (e: any) {
      setError(`Failed to cancel subscription: ${e.message}`);
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No active subscriptions found.</p>
      ) : (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id} <br />
              Status: {subscription.status} <br />
              Price: {(subscription.plan?.amount || 0) / 100} {subscription.plan?.currency?.toUpperCase()} / {subscription.plan?.interval} <br />
              Payment Method: {subscription.default_payment_method ? (subscription.default_payment_method as Stripe.PaymentMethod).type : 'N/A'}
              <button onClick={() => handleCancelSubscription(subscription.id)}>Cancel Subscription</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StripeBilling;