// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setErrorMessage("Failed to initialize Stripe. Please check your API key.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe || !customerId) return;

      try {
        // Simulate fetching subscription status from your backend API
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
        setSubscriptionDetails(data.details);
      } catch (error: any) {
        console.error("Error fetching subscription status:", error);
        setErrorMessage("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    fetchSubscriptionStatus();
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe || !customerId) return;

    try {
      // Simulate creating a checkout session on your backend
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with the actual price ID for the upgraded plan
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setErrorMessage("Failed to create checkout session.");
        setSubscriptionStatus('error');
      }

    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      setErrorMessage("Failed to upgrade subscription. Please try again later.");
      setSubscriptionStatus('error');
    }
  };

  if (subscriptionStatus === 'pending') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      {subscriptionDetails && (
        <div>
          <p>Plan: {subscriptionDetails.planName}</p>
          <p>Next Payment Date: {subscriptionDetails.nextPaymentDate}</p>
        </div>
      )}
      {subscriptionStatus === 'active' && (
        <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
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
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setErrorMessage("Failed to initialize Stripe. Please check your API key.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe || !customerId) return;

      try {
        // Simulate fetching subscription status from your backend API
        const response = await fetch(`/api/subscriptions/${customerId}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
        setSubscriptionDetails(data.details);
      } catch (error: any) {
        console.error("Error fetching subscription status:", error);
        setErrorMessage("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    fetchSubscriptionStatus();
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe || !customerId) return;

    try {
      // Simulate creating a checkout session on your backend
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with the actual price ID for the upgraded plan
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setErrorMessage("Failed to create checkout session.");
        setSubscriptionStatus('error');
      }

    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      setErrorMessage("Failed to upgrade subscription. Please try again later.");
      setSubscriptionStatus('error');
    }
  };

  if (subscriptionStatus === 'pending') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      {subscriptionDetails && (
        <div>
          <p>Plan: {subscriptionDetails.planName}</p>
          <p>Next Payment Date: {subscriptionDetails.nextPaymentDate}</p>
        </div>
      )}
      {subscriptionStatus === 'active' && (
        <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
      )}
    </div>
  );
};

export default StripeBilling;