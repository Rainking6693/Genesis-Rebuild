// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

export default function StripeBilling({ stripePublicKey, customerId }: StripeBillingProps) {
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
        setErrorMessage("Failed to initialize Stripe. Please check your Stripe public key.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns 'active' or 'inactive'
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

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to create a checkout session
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

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error("No session ID returned from the server.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to start subscription process. Please try again later.");
    }
  };

  const handleManageSubscription = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to create a customer portal session
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to the customer portal
      } else {
        throw new Error("No URL returned from the server.");
      }
    } catch (error: any) {
      console.error("Error creating customer portal session:", error);
      setErrorMessage("Failed to manage subscription. Please try again later.");
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
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleManageSubscription}>Manage Subscription</button>
        </div>
      ) : (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

export default function StripeBilling({ stripePublicKey, customerId }: StripeBillingProps) {
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
        setErrorMessage("Failed to initialize Stripe. Please check your Stripe public key.");
        setSubscriptionStatus('error');
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!stripe) return;

      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns 'active' or 'inactive'
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

  const handleSubscribe = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to create a checkout session
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

      const data = await response.json();

      if (data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error("No session ID returned from the server.");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      setErrorMessage("Failed to start subscription process. Please try again later.");
    }
  };

  const handleManageSubscription = async () => {
    if (!stripe) return;

    try {
      // Replace with your actual API endpoint to create a customer portal session
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to the customer portal
      } else {
        throw new Error("No URL returned from the server.");
      }
    } catch (error: any) {
      console.error("Error creating customer portal session:", error);
      setErrorMessage("Failed to manage subscription. Please try again later.");
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
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active!</p>
          <button onClick={handleManageSubscription}>Manage Subscription</button>
        </div>
      ) : (
        <div>
          <p>You don't have an active subscription.</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
}