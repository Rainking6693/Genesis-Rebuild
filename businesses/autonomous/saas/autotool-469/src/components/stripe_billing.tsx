// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have existing customers
  onSuccess: () => void; // Callback for successful subscription
  onError: (error: Error) => void; // Callback for errors
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (!stripeInstance) {
          throw new Error("Stripe failed to load. Check your publishable key.");
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        console.error("Error initializing Stripe:", err);
        setError(err);
        onError(err);
      }
    };

    initializeStripe();
  }, [onError]);

  const handleCheckout = async () => {
    if (!stripe) {
      setError(new Error("Stripe is not initialized."));
      onError(new Error("Stripe is not initialized."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error);
        onError(error);
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading || !stripe}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have existing customers
  onSuccess: () => void; // Callback for successful subscription
  onError: (error: Error) => void; // Callback for errors
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (!stripeInstance) {
          throw new Error("Stripe failed to load. Check your publishable key.");
        }
        setStripe(stripeInstance);
      } catch (err: any) {
        console.error("Error initializing Stripe:", err);
        setError(err);
        onError(err);
      }
    };

    initializeStripe();
  }, [onError]);

  const handleCheckout = async () => {
    if (!stripe) {
      setError(new Error("Stripe is not initialized."));
      onError(new Error("Stripe is not initialized."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error);
        onError(error);
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading || !stripe}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;