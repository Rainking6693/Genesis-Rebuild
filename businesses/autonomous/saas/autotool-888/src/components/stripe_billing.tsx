// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (ideally from environment variables)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Stripe secret key is not defined in environment variables.");
  throw new Error("Stripe secret key is missing.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface SubscriptionData {
  priceId: string;
  customerId?: string;
  subscriptionId?: string;
  status?: string;
}

interface StripeBillingProps {
  userId: string; // Unique identifier for the user in your system
}

const StripeBilling: React.FC<StripeBillingProps> = ({ userId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ priceId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // 1. Check if a customer already exists in Stripe for this user
        let customerId: string | undefined;
        const customers = await stripe.customers.list({
          metadata: { userId: userId },
          limit: 1,
        });

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }

        if (!customerId) {
          // 2. If no customer exists, create one
          const customer = await stripe.customers.create({
            metadata: { userId: userId },
          });
          customerId = customer.id;
        }

        // 3. List subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all', // Include all statuses (active, canceled, etc.)
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          setSubscriptionData({
            priceId: subscription.items.data[0].price.id,
            customerId: customerId,
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        } else {
          setSubscriptionData({ priceId: '', customerId: customerId }); // No subscription found
        }
        setError(null);

      } catch (err: any) {
        console.error("Error fetching subscription status:", err);
        setError(err.message || "Failed to fetch subscription status.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [userId]);

  const createSubscription = async (priceId: string) => {
    setLoading(true);
    try {
      if (!subscriptionData.customerId) {
        throw new Error("Customer ID is missing.  This should have been created during initial load.");
      }

      const subscription = await stripe.subscriptions.create({
        customer: subscriptionData.customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

      if (!clientSecret) {
        throw new Error("Client secret is missing from the payment intent.");
      }

      // Redirect the user to Stripe to complete the payment
      window.location.href = `/api/stripe/confirm-payment?client_secret=${clientSecret}`; // Replace with your actual API endpoint
      setError(null);
    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError(err.message || "Failed to create subscription.");
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setLoading(true);
    try {
      if (!subscriptionData.subscriptionId) {
        throw new Error("Subscription ID is missing.");
      }
      await stripe.subscriptions.cancel(subscriptionData.subscriptionId);
      setSubscriptionData({ ...subscriptionData, status: 'canceled' });
      setError(null);
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message || "Failed to cancel subscription.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscriptionData.status === 'active' ? (
        <div>
          <p>Your subscription is active.</p>
          <button onClick={cancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You do not have an active subscription.</p>
          <button onClick={() => createSubscription('price_1Oxxxxxxxxxxxxxxxxxxx')} disabled={loading}> {/* Replace with a real price ID */}
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (ideally from environment variables)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Stripe secret key is not defined in environment variables.");
  throw new Error("Stripe secret key is missing.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface SubscriptionData {
  priceId: string;
  customerId?: string;
  subscriptionId?: string;
  status?: string;
}

interface StripeBillingProps {
  userId: string; // Unique identifier for the user in your system
}

const StripeBilling: React.FC<StripeBillingProps> = ({ userId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ priceId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // 1. Check if a customer already exists in Stripe for this user
        let customerId: string | undefined;
        const customers = await stripe.customers.list({
          metadata: { userId: userId },
          limit: 1,
        });

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }

        if (!customerId) {
          // 2. If no customer exists, create one
          const customer = await stripe.customers.create({
            metadata: { userId: userId },
          });
          customerId = customer.id;
        }

        // 3. List subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all', // Include all statuses (active, canceled, etc.)
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          setSubscriptionData({
            priceId: subscription.items.data[0].price.id,
            customerId: customerId,
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        } else {
          setSubscriptionData({ priceId: '', customerId: customerId }); // No subscription found
        }
        setError(null);

      } catch (err: any) {
        console.error("Error fetching subscription status:", err);
        setError(err.message || "Failed to fetch subscription status.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [userId]);

  const createSubscription = async (priceId: string) => {
    setLoading(true);
    try {
      if (!subscriptionData.customerId) {
        throw new Error("Customer ID is missing.  This should have been created during initial load.");
      }

      const subscription = await stripe.subscriptions.create({
        customer: subscriptionData.customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

      if (!clientSecret) {
        throw new Error("Client secret is missing from the payment intent.");
      }

      // Redirect the user to Stripe to complete the payment
      window.location.href = `/api/stripe/confirm-payment?client_secret=${clientSecret}`; // Replace with your actual API endpoint
      setError(null);
    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError(err.message || "Failed to create subscription.");
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setLoading(true);
    try {
      if (!subscriptionData.subscriptionId) {
        throw new Error("Subscription ID is missing.");
      }
      await stripe.subscriptions.cancel(subscriptionData.subscriptionId);
      setSubscriptionData({ ...subscriptionData, status: 'canceled' });
      setError(null);
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message || "Failed to cancel subscription.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscriptionData.status === 'active' ? (
        <div>
          <p>Your subscription is active.</p>
          <button onClick={cancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You do not have an active subscription.</p>
          <button onClick={() => createSubscription('price_1Oxxxxxxxxxxxxxxxxxxx')} disabled={loading}> {/* Replace with a real price ID */}
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;