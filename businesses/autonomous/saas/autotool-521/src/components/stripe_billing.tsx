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
    const loadStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error loading Stripe:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to load Stripe. Please check your API key.");
      }
    };

    loadStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Simulate checking subscription status (replace with actual API call)
        // In a real application, you would make an API call to your backend
        // to retrieve the customer's subscription status from Stripe.
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setSubscriptionStatus(data.status); // Assuming the API returns 'active' or 'inactive'
      } catch (error: any) {
        console.error("Error checking subscription status:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to check subscription status. Please try again later.");
      }
    };

    if (stripe) {
      checkSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Simulate subscribing (replace with actual Stripe checkout flow)
      // In a real application, you would use Stripe's Checkout or Elements
      // to handle the payment process.
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_123', quantity: 1 }], // Replace with your actual price ID
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });

      if (error) {
        console.error("Error subscribing:", error);
        setErrorMessage(error.message || "Failed to subscribe. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setErrorMessage("Failed to subscribe. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return (
      <div>
        Error: {errorMessage}
      </div>
    );
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          Your subscription is active!
        </div>
      ) : (
        <div>
          Your subscription is inactive.
          <button onClick={handleSubscribe}>Subscribe Now</button>
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
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error: any) {
        console.error("Error loading Stripe:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to load Stripe. Please check your API key.");
      }
    };

    loadStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Simulate checking subscription status (replace with actual API call)
        // In a real application, you would make an API call to your backend
        // to retrieve the customer's subscription status from Stripe.
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setSubscriptionStatus(data.status); // Assuming the API returns 'active' or 'inactive'
      } catch (error: any) {
        console.error("Error checking subscription status:", error);
        setSubscriptionStatus('error');
        setErrorMessage("Failed to check subscription status. Please try again later.");
      }
    };

    if (stripe) {
      checkSubscriptionStatus();
    }
  }, [stripe, customerId]);

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Simulate subscribing (replace with actual Stripe checkout flow)
      // In a real application, you would use Stripe's Checkout or Elements
      // to handle the payment process.
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_123', quantity: 1 }], // Replace with your actual price ID
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });

      if (error) {
        console.error("Error subscribing:", error);
        setErrorMessage(error.message || "Failed to subscribe. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setErrorMessage("Failed to subscribe. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return (
      <div>
        Error: {errorMessage}
      </div>
    );
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          Your subscription is active!
        </div>
      ) : (
        <div>
          Your subscription is inactive.
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;