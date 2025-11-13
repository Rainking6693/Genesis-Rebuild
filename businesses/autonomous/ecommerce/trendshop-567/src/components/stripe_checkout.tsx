// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
}

const CheckoutForm = ({ amount, currency, onSuccess, onError }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        onError(error);
        return;
      }

      const response = await fetch('/api/create-payment-intent', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setProcessing(false);
        onError(data.error);
        return;
      }

      const { paymentIntent } = data;

      const confirmResult = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.error) {
        setError(confirmResult.error.message);
        setProcessing(false);
        onError(confirmResult.error);
        return;
      }

      if (confirmResult.paymentIntent.status === 'succeeded') {
        onSuccess(confirmResult.paymentIntent);
        setProcessing(false);
      } else {
        setError('Payment failed.');
        setProcessing(false);
        onError(new Error('Payment failed.'));
      }

    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
      onError(err);
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
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const StripeCheckout = ({ amount, currency, onSuccess, onError }: StripeCheckoutProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} currency={currency} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeCheckout;

// Error Boundary Component (Optional - for added robustness)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
}

const CheckoutForm = ({ amount, currency, onSuccess, onError }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        onError(error);
        return;
      }

      const response = await fetch('/api/create-payment-intent', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setProcessing(false);
        onError(data.error);
        return;
      }

      const { paymentIntent } = data;

      const confirmResult = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.error) {
        setError(confirmResult.error.message);
        setProcessing(false);
        onError(confirmResult.error);
        return;
      }

      if (confirmResult.paymentIntent.status === 'succeeded') {
        onSuccess(confirmResult.paymentIntent);
        setProcessing(false);
      } else {
        setError('Payment failed.');
        setProcessing(false);
        onError(new Error('Payment failed.'));
      }

    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
      onError(err);
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
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const StripeCheckout = ({ amount, currency, onSuccess, onError }: StripeCheckoutProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} currency={currency} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeCheckout;

// Error Boundary Component (Optional - for added robustness)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

Now, I will use the `Write` tool to save this code to `src/components/StripeCheckout.tsx`.

Finally, I will generate the build report.