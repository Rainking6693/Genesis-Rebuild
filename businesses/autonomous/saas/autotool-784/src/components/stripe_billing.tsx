// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');

interface BillingProps {
  customerId: string; // Assuming you have a customer ID
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: Error) => void;
}

const StripeBilling: React.FC<BillingProps> = ({ customerId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm customerId={customerId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

const CheckoutForm: React.FC<BillingProps> = ({ customerId, onSuccess, onError }) => {
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
      setError("Card details are incomplete.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || "An unexpected error occurred.");
        onError(new Error(error.message || "An unexpected error occurred.")); // Pass error to parent
        setLoading(false);
        return;
      }

      if (paymentMethod && paymentMethod.id) {
        // Attach the payment method to the customer
        try {
          const response = await fetch('/api/attach-payment-method', { // Replace with your API endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerId: customerId,
              paymentMethodId: paymentMethod.id,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            setError(`Failed to attach payment method: ${errorData.error || 'Unknown error'}`);
            onError(new Error(`Failed to attach payment method: ${errorData.error || 'Unknown error'}`));
            setLoading(false);
            return;
          }

          onSuccess(paymentMethod.id); // Pass paymentMethodId to parent
          setLoading(false);
        } catch (apiError: any) {
          setError(`Error attaching payment method: ${apiError.message || 'Unknown error'}`);
          onError(new Error(`Error attaching payment method: ${apiError.message || 'Unknown error'}`));
          setLoading(false);
        }
      }
    } catch (stripeError: any) {
      setError(`Stripe error: ${stripeError.message || 'Unknown error'}`);
      onError(new Error(`Stripe error: ${stripeError.message || 'Unknown error'}`));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
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
      </label>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default StripeBilling;