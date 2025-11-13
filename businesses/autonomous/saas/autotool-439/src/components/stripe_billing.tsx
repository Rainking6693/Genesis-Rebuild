// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  subscriptionTier: string;
  customerId: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ subscriptionTier, customerId, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm subscriptionTier={subscriptionTier} customerId={customerId} onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} />
    </Elements>
  );
};

const CheckoutForm: React.FC<StripeBillingProps> = ({ subscriptionTier, customerId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const card = elements.getElement(CardElement);

    if (!card) {
      setErrorMessage("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        onPaymentError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Call your backend to create the subscription with the payment method
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          subscriptionTier: subscriptionTier,
          customerId: customerId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        onPaymentError(data.error);
      } else {
        onPaymentSuccess();
      }

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      onPaymentError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Card details
      </label>
      <CardElement id="card-element" />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Subscribe to ${subscriptionTier}`}
      </button>
    </form>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  subscriptionTier: string;
  customerId: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ subscriptionTier, customerId, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm subscriptionTier={subscriptionTier} customerId={customerId} onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} />
    </Elements>
  );
};

const CheckoutForm: React.FC<StripeBillingProps> = ({ subscriptionTier, customerId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const card = elements.getElement(CardElement);

    if (!card) {
      setErrorMessage("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        onPaymentError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Call your backend to create the subscription with the payment method
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          subscriptionTier: subscriptionTier,
          customerId: customerId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        onPaymentError(data.error);
      } else {
        onPaymentSuccess();
      }

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      onPaymentError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Card details
      </label>
      <CardElement id="card-element" />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Subscribe to ${subscriptionTier}`}
      </button>
    </form>
  );
};

export default StripeBilling;

**Action:**