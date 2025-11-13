// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [subscriptions, setSubscriptions] = useState<Stripe.Subscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use a specific API version
        });

        // Fetch Subscriptions
        const subscriptionsResponse = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
        });
        setSubscriptions(subscriptionsResponse.data);

        // Fetch Payment Methods
        const paymentMethodsResponse = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        });
        setPaymentMethods(paymentMethodsResponse.data);

        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching billing data:", e);
        setError(`Failed to fetch billing data: ${e.message}`);
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [stripeApiKey, customerId]);

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id}, Status: {subscription.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}

      <h2>Payment Methods</h2>
      {paymentMethods.length > 0 ? (
        <ul>
          {paymentMethods.map((paymentMethod) => (
            <li key={paymentMethod.id}>
              Payment Method ID: {paymentMethod.id}, Type: {paymentMethod.type}
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment methods found.</p>
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
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const stripe = new Stripe(stripeApiKey, {
          apiVersion: '2023-10-16', // Use a specific API version
        });

        // Fetch Subscriptions
        const subscriptionsResponse = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
        });
        setSubscriptions(subscriptionsResponse.data);

        // Fetch Payment Methods
        const paymentMethodsResponse = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        });
        setPaymentMethods(paymentMethodsResponse.data);

        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching billing data:", e);
        setError(`Failed to fetch billing data: ${e.message}`);
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [stripeApiKey, customerId]);

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              Subscription ID: {subscription.id}, Status: {subscription.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}

      <h2>Payment Methods</h2>
      {paymentMethods.length > 0 ? (
        <ul>
          {paymentMethods.map((paymentMethod) => (
            <li key={paymentMethod.id}>
              Payment Method ID: {paymentMethod.id}, Type: {paymentMethod.type}
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment methods found.</p>
      )}
    </div>
  );
};

export default StripeBilling;