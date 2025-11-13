// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your actual Stripe public key

interface PaymentResult {
  success: boolean;
  message: string;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentResult({ success: false, message: 'Card details are missing.' });
      setIsLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Stripe createPaymentMethod error:', error);
      setPaymentResult({ success: false, message: error.message || 'An error occurred.' });
      setIsLoading(false);
      return;
    }

    // Call your backend to process the payment using the paymentMethod.id
    try {
      const response = await fetch('/api/process-payment', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentResult({ success: true, message: 'Payment successful!' });
      } else {
        setPaymentResult({ success: false, message: data.message || 'Payment failed.' });
      }
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setPaymentResult({ success: false, message: err.message || 'An error occurred while processing the payment.' });
    } finally {
      setIsLoading(false);
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
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
      {paymentResult && (
        <div className={paymentResult.success ? 'success' : 'error'}>
          {paymentResult.message}
        </div>
      )}
    </form>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, info: any) => {
      console.error('Caught an error: ', error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return children;
}

export default function StripeBilling() {
  return (
    <ErrorBoundary>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </ErrorBoundary>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your actual Stripe public key

interface PaymentResult {
  success: boolean;
  message: string;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentResult({ success: false, message: 'Card details are missing.' });
      setIsLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Stripe createPaymentMethod error:', error);
      setPaymentResult({ success: false, message: error.message || 'An error occurred.' });
      setIsLoading(false);
      return;
    }

    // Call your backend to process the payment using the paymentMethod.id
    try {
      const response = await fetch('/api/process-payment', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentResult({ success: true, message: 'Payment successful!' });
      } else {
        setPaymentResult({ success: false, message: data.message || 'Payment failed.' });
      }
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setPaymentResult({ success: false, message: err.message || 'An error occurred while processing the payment.' });
    } finally {
      setIsLoading(false);
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
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
      {paymentResult && (
        <div className={paymentResult.success ? 'success' : 'error'}>
          {paymentResult.message}
        </div>
      )}
    </form>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, info: any) => {
      console.error('Caught an error: ', error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return children;
}

export default function StripeBilling() {
  return (
    <ErrorBoundary>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </ErrorBoundary>
  );
}