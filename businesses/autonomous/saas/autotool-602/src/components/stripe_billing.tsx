// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]); // Replace 'any' with a more specific type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use the latest API version
        });

        const subscriptionList = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.default_payment_method'],
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching subscriptions:", err);
        setError(`Failed to fetch subscriptions: ${err.message}`);
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

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id}<br />
              Status: {subscription.status}<br />
              Price: {subscription.plan?.amount / 100} {subscription.plan?.currency}<br />
              Payment Method: {subscription.default_payment_method?.card?.brand} ending in {subscription.default_payment_method?.card?.last4}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
};

export default StripeBilling;

// Example Usage:
// <StripeBilling stripeApiKey="YOUR_STRIPE_API_KEY" customerId="YOUR_CUSTOMER_ID" />

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]); // Replace 'any' with a more specific type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use the latest API version
        });

        const subscriptionList = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          expand: ['data.default_payment_method'],
        });

        setSubscriptions(subscriptionList.data);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching subscriptions:", err);
        setError(`Failed to fetch subscriptions: ${err.message}`);
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

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id}<br />
              Status: {subscription.status}<br />
              Price: {subscription.plan?.amount / 100} {subscription.plan?.currency}<br />
              Payment Method: {subscription.default_payment_method?.card?.brand} ending in {subscription.default_payment_method?.card?.last4}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
};

export default StripeBilling;

// Example Usage:
// <StripeBilling stripeApiKey="YOUR_STRIPE_API_KEY" customerId="YOUR_CUSTOMER_ID" />