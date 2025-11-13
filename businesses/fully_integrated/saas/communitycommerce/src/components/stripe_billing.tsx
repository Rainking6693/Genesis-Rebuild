import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiKey: string;
  customerId?: string;
  subscriptionId?: string;
  message?: string;
  errorMessage?: string;
}

const MyComponent: FC<Props> = ({ apiKey, customerId, subscriptionId, message, errorMessage }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!apiKey) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/`;
    script.onload = () => {
      setStripe(Stripe(apiKey));
      if (customerId && subscriptionId) {
        const customer = stripe.customers.retrieve(customerId);
        const subscription = stripe.subscriptions.retrieve(subscriptionId);

        customer.then((c) => {
          setSubscription(c.subscriptions.data.find((s: any) => s.id === subscriptionId));
        });
      }
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, customerId, subscriptionId]);

  if (loading) return <div>Loading...</div>;

  if (errorMessage) return (
    <div>
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );

  if (!subscription) return (
    <div>
      <h2>No Subscription Found</h2>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <div>
      <h2>Subscription Details</h2>
      <p>Customer ID: {subscription.customer}</p>
      <p>Subscription ID: {subscription.id}</p>
      <p>Status: {subscription.status}</p>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiKey: string;
  customerId?: string;
  subscriptionId?: string;
  message?: string;
  errorMessage?: string;
}

const MyComponent: FC<Props> = ({ apiKey, customerId, subscriptionId, message, errorMessage }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!apiKey) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/`;
    script.onload = () => {
      setStripe(Stripe(apiKey));
      if (customerId && subscriptionId) {
        const customer = stripe.customers.retrieve(customerId);
        const subscription = stripe.subscriptions.retrieve(subscriptionId);

        customer.then((c) => {
          setSubscription(c.subscriptions.data.find((s: any) => s.id === subscriptionId));
        });
      }
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey, customerId, subscriptionId]);

  if (loading) return <div>Loading...</div>;

  if (errorMessage) return (
    <div>
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );

  if (!subscription) return (
    <div>
      <h2>No Subscription Found</h2>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <div>
      <h2>Subscription Details</h2>
      <p>Customer ID: {subscription.customer}</p>
      <p>Subscription ID: {subscription.id}</p>
      <p>Status: {subscription.status}</p>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MyComponent;