// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface Props {
  stripePublicKey: string;
  subscriptionPlans: { [key: string]: string }; // Plan ID: Price ID
  userId: string;
}

const StripeBilling: React.FC<Props> = ({ stripePublicKey, subscriptionPlans, userId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive'); // inactive, active, canceled
  const [selectedPlan, setSelectedPlan] = useState<string>(Object.keys(subscriptionPlans)[0] || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripePublicKey, {
        apiVersion: '2023-10-16', // Use the latest API version
      });
      setStripe(stripeInstance);
    } catch (err: any) {
      console.error("Failed to initialize Stripe:", err);
      setError("Failed to initialize Stripe. Please check your API key.");
    }
  }, [stripePublicKey]);

  // Function to handle subscription creation
  const handleSubscribe = async () => {
    if (!stripe) {
      setError("Stripe not initialized.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: subscriptionPlans[selectedPlan],
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session.");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      console.error("Error creating checkout session:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle subscription cancellation (example)
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call your backend to cancel the subscription
      const response = await fetch('/api/cancel-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription.");
      }

      setSubscriptionStatus('canceled');
      alert("Subscription canceled successfully.");
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for fetching subscription status from your backend
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace with your API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data.status); // Assuming your API returns a 'status' field
        } else {
          console.warn("Failed to fetch subscription status.");
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscriptionStatus();
  }, [userId]);

  return (
    <div>
      <h2>Stripe Billing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active.</p>
          <button onClick={handleCancelSubscription} disabled={isLoading}>
            {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      ) : (
        <div>
          <p>Choose a subscription plan:</p>
          <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            {Object.keys(subscriptionPlans).map((planId) => (
              <option key={planId} value={planId}>
                {planId}
              </option>
            ))}
          </select>
          <button onClick={handleSubscribe} disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;