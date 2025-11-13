// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setErrorMessage("Failed to initialize Stripe. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptionStatus?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (error: any) {
        console.error("Error fetching subscription status:", error);
        setErrorMessage("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    if (stripe) {
      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to initiate subscription upgrade
      const response = await fetch(`/api/upgradeSubscription?customerId=${customerId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      stripe.redirectToCheckout({ sessionId: data.sessionId });

    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      setErrorMessage("Failed to upgrade subscription. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
        </div>
      ) : (
        <div>
          <p>Your subscription is inactive.</p>
          <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        setErrorMessage("Failed to initialize Stripe. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptionStatus?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (error: any) {
        console.error("Error fetching subscription status:", error);
        setErrorMessage("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    if (stripe) {
      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to initiate subscription upgrade
      const response = await fetch(`/api/upgradeSubscription?customerId=${customerId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      stripe.redirectToCheckout({ sessionId: data.sessionId });

    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      setErrorMessage("Failed to upgrade subscription. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
        </div>
      ) : (
        <div>
          <p>Your subscription is inactive.</p>
          <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;