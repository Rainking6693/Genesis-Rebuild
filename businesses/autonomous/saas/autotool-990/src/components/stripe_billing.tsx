// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (err: any) {
      console.error("Error initializing Stripe:", err);
      setError(`Failed to initialize Stripe: ${err.message}`);
    }
  }, [stripeApiKey]);

  useEffect(() => {
    if (stripe && customerId) {
      fetchSubscriptionStatus(stripe, customerId);
      fetchPaymentMethods(stripe, customerId);
    }
  }, [stripe, customerId]);

  const fetchSubscriptionStatus = async (stripeInstance: Stripe, customerId: string) => {
    try {
      // Simulate fetching subscription status from backend
      // In a real application, this would be an API call to your server
      const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus(data.status);
      } else {
        setError(`Failed to fetch subscription status: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error fetching subscription status:", err);
      setError(`Failed to fetch subscription status: ${err.message}`);
    }
  };

  const fetchPaymentMethods = async (stripeInstance: Stripe, customerId: string) => {
    try {
      if (!stripeInstance) {
        throw new Error("Stripe instance is not initialized.");
      }

      const paymentMethodsResult = await stripeInstance.customers.listPaymentMethods(customerId, {
        type: 'card',
      });
      setPaymentMethods(paymentMethodsResult.data);
    } catch (err: any) {
      console.error("Error fetching payment methods:", err);
      setError(`Failed to fetch payment methods: ${err.message}`);
    }
  };

  const handlePayment = async (paymentMethodId: string) => {
    try {
      // Simulate creating a subscription on the backend
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          priceId: 'price_123', // Replace with your actual price ID
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('active');
        alert('Subscription created successfully!');
      } else {
        setError(`Failed to create subscription: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError(`Failed to create subscription: ${err.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      <p>Subscription Status: {subscriptionStatus}</p>
      <h3>Payment Methods:</h3>
      <ul>
        {paymentMethods.map((pm) => (
          <li key={pm.id}>
            {pm.card?.brand} ending in {pm.card?.last4}
            <button onClick={() => handlePayment(pm.id)}>Use This Card</button>
          </li>
        ))}
      </ul>
      {/* Add UI for adding new payment methods, etc. */}
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);
    } catch (err: any) {
      console.error("Error initializing Stripe:", err);
      setError(`Failed to initialize Stripe: ${err.message}`);
    }
  }, [stripeApiKey]);

  useEffect(() => {
    if (stripe && customerId) {
      fetchSubscriptionStatus(stripe, customerId);
      fetchPaymentMethods(stripe, customerId);
    }
  }, [stripe, customerId]);

  const fetchSubscriptionStatus = async (stripeInstance: Stripe, customerId: string) => {
    try {
      // Simulate fetching subscription status from backend
      // In a real application, this would be an API call to your server
      const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus(data.status);
      } else {
        setError(`Failed to fetch subscription status: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error fetching subscription status:", err);
      setError(`Failed to fetch subscription status: ${err.message}`);
    }
  };

  const fetchPaymentMethods = async (stripeInstance: Stripe, customerId: string) => {
    try {
      if (!stripeInstance) {
        throw new Error("Stripe instance is not initialized.");
      }

      const paymentMethodsResult = await stripeInstance.customers.listPaymentMethods(customerId, {
        type: 'card',
      });
      setPaymentMethods(paymentMethodsResult.data);
    } catch (err: any) {
      console.error("Error fetching payment methods:", err);
      setError(`Failed to fetch payment methods: ${err.message}`);
    }
  };

  const handlePayment = async (paymentMethodId: string) => {
    try {
      // Simulate creating a subscription on the backend
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          priceId: 'price_123', // Replace with your actual price ID
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('active');
        alert('Subscription created successfully!');
      } else {
        setError(`Failed to create subscription: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError(`Failed to create subscription: ${err.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      <p>Subscription Status: {subscriptionStatus}</p>
      <h3>Payment Methods:</h3>
      <ul>
        {paymentMethods.map((pm) => (
          <li key={pm.id}>
            {pm.card?.brand} ending in {pm.card?.last4}
            <button onClick={() => handlePayment(pm.id)}>Use This Card</button>
          </li>
        ))}
      </ul>
      {/* Add UI for adding new payment methods, etc. */}
    </div>
  );
};

export default StripeBilling;