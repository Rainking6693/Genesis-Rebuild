// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

interface Subscription {
  id: string;
  status: string;
  price: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      console.error("Error initializing Stripe:", e);
      setError("Failed to initialize Stripe. Please check your API key.");
      setLoading(false);
      return;
    }
  }, [stripeApiKey]);

  useEffect(() => {
    if (stripe && customerId) {
      setLoading(true);
      fetchSubscriptions(stripe, customerId)
        .then(subs => {
          setSubscriptions(subs);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [stripe, customerId]);

  const fetchSubscriptions = async (stripeInstance: Stripe, customerId: string): Promise<Subscription[]> => {
    try {
      const subscriptions = await stripeInstance.subscriptions.list({
        customer: customerId,
        status: 'active',
      });

      return subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        price: sub.items.data[0].price?.unit_amount_decimal ? (parseFloat(sub.items.data[0].price.unit_amount_decimal) / 100).toFixed(2) : "Unknown",
      }));
    } catch (e: any) {
      console.error("Error fetching subscriptions:", e);
      throw new Error("Failed to fetch subscriptions. Please try again later.");
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setLoading(true);
      if (!stripe) {
        throw new Error("Stripe not initialized.");
      }
      await stripe.subscriptions.cancel(subscriptionId);
      // Refresh subscriptions after cancellation
      const subs = await fetchSubscriptions(stripe, customerId);
      setSubscriptions(subs);
      setLoading(false);
    } catch (e: any) {
      console.error("Error cancelling subscription:", e);
      setError("Failed to cancel subscription. Please try again later.");
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map(sub => (
            <li key={sub.id}>
              Subscription ID: {sub.id}, Status: {sub.status}, Price: ${sub.price}
              <button onClick={() => handleCancelSubscription(sub.id)} disabled={loading}>
                Cancel Subscription
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active subscriptions found.</p>
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

interface Subscription {
  id: string;
  status: string;
  price: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (e: any) {
      console.error("Error initializing Stripe:", e);
      setError("Failed to initialize Stripe. Please check your API key.");
      setLoading(false);
      return;
    }
  }, [stripeApiKey]);

  useEffect(() => {
    if (stripe && customerId) {
      setLoading(true);
      fetchSubscriptions(stripe, customerId)
        .then(subs => {
          setSubscriptions(subs);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [stripe, customerId]);

  const fetchSubscriptions = async (stripeInstance: Stripe, customerId: string): Promise<Subscription[]> => {
    try {
      const subscriptions = await stripeInstance.subscriptions.list({
        customer: customerId,
        status: 'active',
      });

      return subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        price: sub.items.data[0].price?.unit_amount_decimal ? (parseFloat(sub.items.data[0].price.unit_amount_decimal) / 100).toFixed(2) : "Unknown",
      }));
    } catch (e: any) {
      console.error("Error fetching subscriptions:", e);
      throw new Error("Failed to fetch subscriptions. Please try again later.");
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setLoading(true);
      if (!stripe) {
        throw new Error("Stripe not initialized.");
      }
      await stripe.subscriptions.cancel(subscriptionId);
      // Refresh subscriptions after cancellation
      const subs = await fetchSubscriptions(stripe, customerId);
      setSubscriptions(subs);
      setLoading(false);
    } catch (e: any) {
      console.error("Error cancelling subscription:", e);
      setError("Failed to cancel subscription. Please try again later.");
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {subscriptions.length > 0 ? (
        <ul>
          {subscriptions.map(sub => (
            <li key={sub.id}>
              Subscription ID: {sub.id}, Status: {sub.status}, Price: ${sub.price}
              <button onClick={() => handleCancelSubscription(sub.id)} disabled={loading}>
                Cancel Subscription
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active subscriptions found.</p>
      )}
    </div>
  );
};

export default StripeBilling;