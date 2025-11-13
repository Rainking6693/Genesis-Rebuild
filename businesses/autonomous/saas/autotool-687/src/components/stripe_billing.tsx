// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  subscriptionTier: string;
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ subscriptionTier, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm subscriptionTier={subscriptionTier} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

const CheckoutForm: React.FC<StripeBillingProps> = ({ subscriptionTier, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError("Card details are missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe Payment Method Error:", error);
        onError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      if (paymentMethod && paymentMethod.id) {
        onSuccess(paymentMethod.id);
        setLoading(false);
      } else {
        onError("Payment method creation failed.");
        setLoading(false);
      }

    } catch (err: any) {
      console.error("Stripe Error:", err);
      onError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Card details
      </label>
      <CardElement id="card-element" />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Subscribe to ${subscriptionTier}`}
      </button>
    </form>
  );
};

export default StripeBilling;