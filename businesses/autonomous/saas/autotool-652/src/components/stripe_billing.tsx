// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface Props {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<Props> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState(true);
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
          expand: ['data.items.data.price.product'], // Expand to get product details
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching subscriptions:", e);
        setError(`Failed to fetch subscriptions: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId]);

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (subscriptions.length === 0) {
    return <div>No active subscriptions found.</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            Subscription ID: {subscription.id}<br />
            Status: {subscription.status}<br />
            Created: {new Date(subscription.created * 1000).toLocaleDateString()}<br />
            {subscription.items.data.map((item) => (
              <div key={item.id}>
                Product: {(item.price?.product as Stripe.Product)?.name || 'Unknown Product'}<br />
                Price: {item.price?.unit_amount_decimal} {item.price?.currency}<br />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface Props {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<Props> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [loading, setLoading] = useState(true);
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
          expand: ['data.items.data.price.product'], // Expand to get product details
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching subscriptions:", e);
        setError(`Failed to fetch subscriptions: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [stripeApiKey, customerId]);

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (subscriptions.length === 0) {
    return <div>No active subscriptions found.</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      <ul>
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            Subscription ID: {subscription.id}<br />
            Status: {subscription.status}<br />
            Created: {new Date(subscription.created * 1000).toLocaleDateString()}<br />
            {subscription.items.data.map((item) => (
              <div key={item.id}>
                Product: {(item.price?.product as Stripe.Product)?.name || 'Unknown Product'}<br />
                Price: {item.price?.unit_amount_decimal} {item.price?.currency}<br />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StripeBilling;