// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

// Replace with your actual Stripe publishable key
const stripePublishableKey = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

// Initialize Stripe
const stripe = new Stripe(stripePublishableKey, {
  apiVersion: '2023-10-16', // Replace with the latest API version
});

interface Subscription {
  id: string;
  status: string;
  items: { data: { price: { product: string; unit_amount: number } }[] };
}

interface PaymentMethod {
  id: string;
  type: string;
  card: { brand: string; last4: string };
}

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active', // or 'all' to fetch all subscriptions
          expand: ['data.items.data.price.product'],
        });

        if (subscriptions.data.length > 0) {
          setSubscription(subscriptions.data[0] as Subscription);
        } else {
          setSubscription(null); // No active subscription
        }

        // Fetch Payment Methods
        const paymentMethodsResponse = await stripe.customers.listPaymentMethods(
          customerId,
          { type: 'card' }
        );
        setPaymentMethods(paymentMethodsResponse.data as PaymentMethod[]);

      } catch (err: any) {
        console.error("Error fetching billing data:", err);
        setError(`Failed to fetch billing data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [customerId]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      await stripe.subscriptions.cancel(subscription.id);
      setSubscription(null); // Update state after cancellation
      alert('Subscription cancelled successfully.');
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(`Failed to cancel subscription: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      {subscription ? (
        <div>
          <h3>Subscription Details</h3>
          <p>Status: {subscription.status}</p>
          <p>Product: {subscription.items.data[0].price.product}</p>
          <p>Amount: {(subscription.items.data[0].price.unit_amount! / 100).toFixed(2)}</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <p>No active subscription found.</p>
      )}

      <h3>Payment Methods</h3>
      {paymentMethods.length > 0 ? (
        <ul>
          {paymentMethods.map((pm) => (
            <li key={pm.id}>
              {pm.type} - {pm.card?.brand} ending in {pm.card?.last4}
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

// Replace with your actual Stripe publishable key
const stripePublishableKey = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';

// Initialize Stripe
const stripe = new Stripe(stripePublishableKey, {
  apiVersion: '2023-10-16', // Replace with the latest API version
});

interface Subscription {
  id: string;
  status: string;
  items: { data: { price: { product: string; unit_amount: number } }[] };
}

interface PaymentMethod {
  id: string;
  type: string;
  card: { brand: string; last4: string };
}

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active', // or 'all' to fetch all subscriptions
          expand: ['data.items.data.price.product'],
        });

        if (subscriptions.data.length > 0) {
          setSubscription(subscriptions.data[0] as Subscription);
        } else {
          setSubscription(null); // No active subscription
        }

        // Fetch Payment Methods
        const paymentMethodsResponse = await stripe.customers.listPaymentMethods(
          customerId,
          { type: 'card' }
        );
        setPaymentMethods(paymentMethodsResponse.data as PaymentMethod[]);

      } catch (err: any) {
        console.error("Error fetching billing data:", err);
        setError(`Failed to fetch billing data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [customerId]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      await stripe.subscriptions.cancel(subscription.id);
      setSubscription(null); // Update state after cancellation
      alert('Subscription cancelled successfully.');
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(`Failed to cancel subscription: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      {subscription ? (
        <div>
          <h3>Subscription Details</h3>
          <p>Status: {subscription.status}</p>
          <p>Product: {subscription.items.data[0].price.product}</p>
          <p>Amount: {(subscription.items.data[0].price.unit_amount! / 100).toFixed(2)}</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <p>No active subscription found.</p>
      )}

      <h3>Payment Methods</h3>
      {paymentMethods.length > 0 ? (
        <ul>
          {paymentMethods.map((pm) => (
            <li key={pm.id}>
              {pm.type} - {pm.card?.brand} ending in {pm.card?.last4}
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