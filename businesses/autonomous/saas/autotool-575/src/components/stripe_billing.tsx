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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);

      // Fetch subscription status (example)
      const fetchSubscriptionStatus = async () => {
        if (stripeInstance) {
          try {
            // Replace with actual Stripe API call to fetch subscription status
            // This is a placeholder and needs to be implemented with your backend
            const subscription = { status: 'active' }; // Example response
            setSubscriptionStatus(subscription.status);
          } catch (error: any) {
            console.error("Error fetching subscription status:", error);
            setErrorMessage("Failed to fetch subscription status. Please try again.");
          }
        }
      };

      fetchSubscriptionStatus();

    } catch (error: any) {
      console.error("Error initializing Stripe:", error);
      setErrorMessage("Failed to initialize Stripe. Please check your API key.");
    }
  }, [stripeApiKey, customerId]);

  const handleUpgradeSubscription = async () => {
    if (!stripe) {
      setErrorMessage("Stripe not initialized. Please try again later.");
      return;
    }

    try {
      // Replace with actual Stripe API call to upgrade subscription
      // This is a placeholder and needs to be implemented with your backend
      console.log("Upgrading subscription for customer:", customerId);
      // const upgradeResult = await stripe.subscriptions.update(subscriptionId, { items: [{ price: 'YOUR_NEW_PRICE_ID' }] });

      // Simulate success
      alert("Subscription upgrade initiated.  This is a placeholder and needs to be implemented with your backend.");

    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      setErrorMessage("Failed to upgrade subscription. Please contact support.");
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <p>Subscription Status: {subscriptionStatus}</p>
      <button onClick={handleUpgradeSubscription} disabled={subscriptionStatus === 'active'}>
        Upgrade Subscription
      </button>
    </div>
  );
};

export default StripeBilling;