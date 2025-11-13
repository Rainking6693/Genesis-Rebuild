// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

interface StripeBillingProps {
  priceId: string;
  customerId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm priceId={priceId} customerId={customerId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

interface CheckoutFormProps {
  priceId: string;
  customerId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardSetup(
        process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as any,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe Error:", error);
        setError(error.message || "An unexpected error occurred.");
        onError(new Error(error.message || "An unexpected error occurred."));
      } else {
        // The card has been verified successfully...
        console.log('Card verified successfully!');
        onSuccess(); // Call the success callback
      }
    } catch (err: any) {
      console.error("General Error:", err);
      setError(err.message || "An unexpected error occurred.");
      onError(err);
    } finally {
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
        {error}
      </div>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Loading...' : 'Verify Card'}
      </button>
    </form>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

interface StripeBillingProps {
  priceId: string;
  customerId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm priceId={priceId} customerId={customerId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

interface CheckoutFormProps {
  priceId: string;
  customerId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardSetup(
        process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as any,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe Error:", error);
        setError(error.message || "An unexpected error occurred.");
        onError(new Error(error.message || "An unexpected error occurred."));
      } else {
        // The card has been verified successfully...
        console.log('Card verified successfully!');
        onSuccess(); // Call the success callback
      }
    } catch (err: any) {
      console.error("General Error:", err);
      setError(err.message || "An unexpected error occurred.");
      onError(err);
    } finally {
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
        {error}
      </div>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Loading...' : 'Verify Card'}
      </button>
    </form>
  );
};

export default StripeBilling;