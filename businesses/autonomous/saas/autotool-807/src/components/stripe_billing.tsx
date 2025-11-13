// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  stripeApiKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripeApiKey, customerId }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);

      // Fetch subscription status and data
      const fetchSubscription = async () => {
        try {
          if (!stripeInstance) {
            throw new Error("Stripe instance not initialized.");
          }
          const response = await fetch(`/api/stripe/subscription?customerId=${customerId}`); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionData(data);
          setSubscriptionStatus(data.status); // Assuming your API returns a 'status' field
        } catch (fetchError: any) {
          console.error("Error fetching subscription:", fetchError);
          setError(fetchError.message || "Failed to fetch subscription.");
          setSubscriptionStatus('error');
        }
      };

      fetchSubscription();
    } catch (initializationError: any) {
      console.error("Error initializing Stripe:", initializationError);
      setError(initializationError.message || "Failed to initialize Stripe.");
      setSubscriptionStatus('error');
    }
  }, [stripeApiKey, customerId]);

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!stripe) {
        throw new Error("Stripe instance not initialized.");
      }

      const response = await fetch('/api/stripe/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error("No session ID returned from the server.");
      }
    } catch (checkoutError: any) {
      console.error("Error creating checkout session:", checkoutError);
      setError(checkoutError.message || "Failed to create checkout session.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData?.id, // Assuming your API returns a subscription 'id'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh subscription status after cancellation
      setSubscriptionStatus('loading');
      const data = await response.json();
      setSubscriptionData(data);
      setSubscriptionStatus(data.status);
    } catch (cancelError: any) {
      console.error("Error cancelling subscription:", cancelError);
      setError(cancelError.message || "Failed to cancel subscription.");
      setSubscriptionStatus('error');
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <>
          <p>Subscription Status: Active</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </>
      ) : (
        <>
          <p>Subscription Status: Inactive</p>
          <button onClick={() => handleSubscribe('price_1N...')}>Subscribe</button> {/* Replace with your actual price ID */}
        </>
      )}
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stripeInstance = new Stripe(stripeApiKey, {
        apiVersion: '2023-10-16', // Use a specific API version
      });
      setStripe(stripeInstance);

      // Fetch subscription status and data
      const fetchSubscription = async () => {
        try {
          if (!stripeInstance) {
            throw new Error("Stripe instance not initialized.");
          }
          const response = await fetch(`/api/stripe/subscription?customerId=${customerId}`); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionData(data);
          setSubscriptionStatus(data.status); // Assuming your API returns a 'status' field
        } catch (fetchError: any) {
          console.error("Error fetching subscription:", fetchError);
          setError(fetchError.message || "Failed to fetch subscription.");
          setSubscriptionStatus('error');
        }
      };

      fetchSubscription();
    } catch (initializationError: any) {
      console.error("Error initializing Stripe:", initializationError);
      setError(initializationError.message || "Failed to initialize Stripe.");
      setSubscriptionStatus('error');
    }
  }, [stripeApiKey, customerId]);

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!stripe) {
        throw new Error("Stripe instance not initialized.");
      }

      const response = await fetch('/api/stripe/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error("No session ID returned from the server.");
      }
    } catch (checkoutError: any) {
      console.error("Error creating checkout session:", checkoutError);
      setError(checkoutError.message || "Failed to create checkout session.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData?.id, // Assuming your API returns a subscription 'id'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh subscription status after cancellation
      setSubscriptionStatus('loading');
      const data = await response.json();
      setSubscriptionData(data);
      setSubscriptionStatus(data.status);
    } catch (cancelError: any) {
      console.error("Error cancelling subscription:", cancelError);
      setError(cancelError.message || "Failed to cancel subscription.");
      setSubscriptionStatus('error');
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <>
          <p>Subscription Status: Active</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </>
      ) : (
        <>
          <p>Subscription Status: Inactive</p>
          <button onClick={() => handleSubscribe('price_1N...')}>Subscribe</button> {/* Replace with your actual price ID */}
        </>
      )}
    </div>
  );
};

export default StripeBilling;