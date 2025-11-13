// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (stripe && customerId) {
      const fetchSubscriptionStatus = async () => {
        try {
          // Replace with your actual API endpoint to fetch subscription status
          const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionStatus(data.status); // e.g., 'active', 'inactive', 'trialing'
        } catch (error: any) {
          console.error("Error fetching subscription status:", error);
          setErrorMessage("Failed to fetch subscription status. Please try again later.");
          setSubscriptionStatus('error');
        }
      };

      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) {
      setErrorMessage("Stripe is not initialized yet.");
      return;
    }

    try {
      // Replace with your actual API endpoint to create a checkout session for upgrading
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: customerId, priceId: 'YOUR_PREMIUM_PRICE_ID' }), // Replace with your premium price ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setErrorMessage("Failed to create checkout session.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to create checkout session. Please try again later.");
    }
  };

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="stripe-billing">
      <h2>Subscription Status</h2>
      {subscriptionStatus === 'loading' && <p>Loading...</p>}
      {subscriptionStatus === 'active' && <p>Your subscription is active.</p>}
      {subscriptionStatus === 'inactive' && <p>Your subscription is inactive.</p>}
      {subscriptionStatus === 'trialing' && <p>Your subscription is in trial mode.</p>}
      {subscriptionStatus === 'error' && <p>Error fetching subscription status.</p>}

      <button onClick={handleUpgradeSubscription} disabled={subscriptionStatus === 'active'}>
        Upgrade Subscription
      </button>
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (stripe && customerId) {
      const fetchSubscriptionStatus = async () => {
        try {
          // Replace with your actual API endpoint to fetch subscription status
          const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionStatus(data.status); // e.g., 'active', 'inactive', 'trialing'
        } catch (error: any) {
          console.error("Error fetching subscription status:", error);
          setErrorMessage("Failed to fetch subscription status. Please try again later.");
          setSubscriptionStatus('error');
        }
      };

      fetchSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) {
      setErrorMessage("Stripe is not initialized yet.");
      return;
    }

    try {
      // Replace with your actual API endpoint to create a checkout session for upgrading
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: customerId, priceId: 'YOUR_PREMIUM_PRICE_ID' }), // Replace with your premium price ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        setErrorMessage("Failed to create checkout session.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to create checkout session. Please try again later.");
    }
  };

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="stripe-billing">
      <h2>Subscription Status</h2>
      {subscriptionStatus === 'loading' && <p>Loading...</p>}
      {subscriptionStatus === 'active' && <p>Your subscription is active.</p>}
      {subscriptionStatus === 'inactive' && <p>Your subscription is inactive.</p>}
      {subscriptionStatus === 'trialing' && <p>Your subscription is in trial mode.</p>}
      {subscriptionStatus === 'error' && <p>Error fetching subscription status.</p>}

      <button onClick={handleUpgradeSubscription} disabled={subscriptionStatus === 'active'}>
        Upgrade Subscription
      </button>
    </div>
  );
};

export default StripeBilling;