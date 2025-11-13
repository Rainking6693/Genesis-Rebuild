// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface BillingProps {
  customerId: string; // Assuming you have a customer ID
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: Error) => void;
}

const BillingForm: React.FC<BillingProps> = ({ customerId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are missing.");
      setLoading(false);
      onError(new Error("Card details are missing.")); // Report error to parent component
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          // You can add billing details here, like name and address
        },
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setError(error.message || "An unexpected error occurred.");
        setLoading(false);
        onError(error); // Report error to parent component
        return;
      }

      if (paymentMethod && paymentMethod.id) {
        // Payment method created successfully!  Now you can attach it to the customer.
        console.log("Payment method created:", paymentMethod.id);
        onSuccess(paymentMethod.id); // Report success to parent component
        setLoading(false);
      } else {
        setError("Payment method creation failed.");
        setLoading(false);
        onError(new Error("Payment method creation failed.")); // Report error to parent component
      }

    } catch (err: any) {
      console.error("Error during payment method creation:", err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
      onError(err); // Report error to parent component
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

const StripeBilling: React.FC<BillingProps> = ({ customerId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <BillingForm customerId={customerId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeBilling;