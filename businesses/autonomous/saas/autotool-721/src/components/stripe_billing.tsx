// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  planId: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, planId, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const handleSubscribe = async () => {
    if (!stripe) {
      setError('Stripe is not initialized.');
      return;
    }

    try {
      // Simulate creating a subscription (replace with actual Stripe API call)
      setLoading(true);
      console.log(`Subscribing customer ${customerId} to plan ${planId}...`);
      // In a real implementation, you would use Stripe's API to create a subscription.
      // This is a placeholder.
      setTimeout(() => {
        setSubscriptionStatus('active');
        setLoading(false);
      }, 2000); // Simulate API call delay

    } catch (err: any) {
      setError(`Subscription failed: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscriptionStatus ? (
        <p>Subscription Status: {subscriptionStatus}</p>
      ) : (
        <button onClick={handleSubscribe}>Subscribe Now</button>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  planId: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, planId, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
        setLoading(false);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  const handleSubscribe = async () => {
    if (!stripe) {
      setError('Stripe is not initialized.');
      return;
    }

    try {
      // Simulate creating a subscription (replace with actual Stripe API call)
      setLoading(true);
      console.log(`Subscribing customer ${customerId} to plan ${planId}...`);
      // In a real implementation, you would use Stripe's API to create a subscription.
      // This is a placeholder.
      setTimeout(() => {
        setSubscriptionStatus('active');
        setLoading(false);
      }, 2000); // Simulate API call delay

    } catch (err: any) {
      setError(`Subscription failed: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscriptionStatus ? (
        <p>Subscription Status: {subscriptionStatus}</p>
      ) : (
        <button onClick={handleSubscribe}>Subscribe Now</button>
      )}
    </div>
  );
};

export default StripeBilling;