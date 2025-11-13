// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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

interface CheckoutFormProps {
  customerId: string;
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ customerId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are missing.");
      setProcessing(false);
      onError("Card details are missing.");
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setError(error.message || "An unexpected error occurred.");
        setProcessing(false);
        onError(error.message || "An unexpected error occurred.");
        return;
      }

      if (!paymentMethod) {
        setError("Failed to create payment method.");
        setProcessing(false);
        onError("Failed to create payment method.");
        return;
      }

      // Attach the payment method to the customer
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

      const data = await response.json();

      if (!response.ok) {
        console.error("API attach-payment-method error:", data);
        setError(data.error || "Failed to attach payment method to customer.");
        setProcessing(false);
        onError(data.error || "Failed to attach payment method to customer.");
        return;
      }

      onSuccess(paymentMethod.id);
      setProcessing(false);

    } catch (err: any) {
      console.error("Unexpected error during payment processing:", err);
      setError(err.message || "An unexpected error occurred.");
      setProcessing(false);
      onError(err.message || "An unexpected error occurred.");
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
      <button type="submit" disabled={processing || !stripe || !elements}>
        {processing ? 'Processing...' : 'Add Payment Method'}
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

interface CheckoutFormProps {
  customerId: string;
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ customerId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are missing.");
      setProcessing(false);
      onError("Card details are missing.");
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setError(error.message || "An unexpected error occurred.");
        setProcessing(false);
        onError(error.message || "An unexpected error occurred.");
        return;
      }

      if (!paymentMethod) {
        setError("Failed to create payment method.");
        setProcessing(false);
        onError("Failed to create payment method.");
        return;
      }

      // Attach the payment method to the customer
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

      const data = await response.json();

      if (!response.ok) {
        console.error("API attach-payment-method error:", data);
        setError(data.error || "Failed to attach payment method to customer.");
        setProcessing(false);
        onError(data.error || "Failed to attach payment method to customer.");
        return;
      }

      onSuccess(paymentMethod.id);
      setProcessing(false);

    } catch (err: any) {
      console.error("Unexpected error during payment processing:", err);
      setError(err.message || "An unexpected error occurred.");
      setProcessing(false);
      onError(err.message || "An unexpected error occurred.");
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
      <button type="submit" disabled={processing || !stripe || !elements}>
        {processing ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default StripeBilling;