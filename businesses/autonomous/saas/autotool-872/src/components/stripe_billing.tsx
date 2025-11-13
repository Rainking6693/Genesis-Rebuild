// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to initialize Stripe. Please check your API key.");
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!stripe || !customerId) return;

      try {
        // Simulate API call to check subscription status (replace with actual API call)
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setSubscriptionStatus(data.status); // Assuming API returns 'active' or 'inactive'
      } catch (error: any) {
        console.error("Error checking subscription status:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to check subscription status. Please try again later.");
      }
    };

    checkSubscriptionStatus();
  }, [stripe, customerId]);

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Simulate API call to create a checkout session (replace with actual API call)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to start subscription. Please try again later.");
    }
  };

  const renderContent = () => {
    switch (subscriptionStatus) {
      case 'loading':
        return <p>Loading subscription status...</p>;
      case 'active':
        return <p>Your subscription is active!</p>;
      case 'inactive':
        return <button onClick={handleSubscribe}>Subscribe Now</button>;
      case 'error':
        return <p>Error: {errorMessage}</p>;
      default:
        return <p>Unexpected state.</p>;
    }
  };

  return (
    <div>
      <h2>Stripe Billing</h2>
      {renderContent()}
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to initialize Stripe. Please check your API key.");
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!stripe || !customerId) return;

      try {
        // Simulate API call to check subscription status (replace with actual API call)
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setSubscriptionStatus(data.status); // Assuming API returns 'active' or 'inactive'
      } catch (error: any) {
        console.error("Error checking subscription status:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to check subscription status. Please try again later.");
      }
    };

    checkSubscriptionStatus();
  }, [stripe, customerId]);

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Simulate API call to create a checkout session (replace with actual API call)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to start subscription. Please try again later.");
    }
  };

  const renderContent = () => {
    switch (subscriptionStatus) {
      case 'loading':
        return <p>Loading subscription status...</p>;
      case 'active':
        return <p>Your subscription is active!</p>;
      case 'inactive':
        return <button onClick={handleSubscribe}>Subscribe Now</button>;
      case 'error':
        return <p>Error: {errorMessage}</p>;
      default:
        return <p>Unexpected state.</p>;
    }
  };

  return (
    <div>
      <h2>Stripe Billing</h2>
      {renderContent()}
    </div>
  );
};

export default StripeBilling;