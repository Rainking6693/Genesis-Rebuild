// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm customerId={customerId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

const CheckoutForm: React.FC<StripeBillingProps> = ({ customerId, onSuccess, onError }) => {
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

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card element is missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
        onError(error.message || "An unexpected error occurred."); // Pass error to parent component
        setLoading(false);
        return;
      }

      // Attach payment method to customer (Server-side call required for production)
      // In a real application, you would send the paymentMethod.id to your server
      // to attach it to the customer using the Stripe API.
      // Example: await fetch('/api/attach-payment-method', { method: 'POST', body: JSON.stringify({ customerId, paymentMethodId: paymentMethod.id }) });

      console.log("Payment Method ID:", paymentMethod.id);
      onSuccess(paymentMethod.id); // Pass paymentMethodId to parent component
      setLoading(false);

    } catch (e: any) {
      console.error("Error during payment processing:", e);
      setErrorMessage(e.message || "An unexpected error occurred.");
      onError(e.message || "An unexpected error occurred."); // Pass error to parent component
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Credit or debit card
      </label>
      <CardElement id="card-element" />
      <div className="error-message" role="alert">
        {errorMessage}
      </div>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Submit Payment'}
      </button>
    </form>
  );
};

export default StripeBilling;