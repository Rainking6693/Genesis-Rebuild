import React, { useState, useEffect, useCallback } from 'react';
import {
  loadStripe,
  StripeElementsOptions,
  StripeElements,
  StripeError,
  PaymentIntent,
} from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: StripeError) => void;
  clientSecret: string; // Make clientSecret a required prop
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  loadingMessage = 'Processing...',
  successMessage = 'Payment Successful!',
  errorMessage = 'Payment Failed.',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true); // Disable submit until card details are valid
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return; // Prevent multiple submissions
    }

    setIsProcessing(true);
    setPaymentStatus(loadingMessage);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentError({ type: 'validation_error', message: 'Card element not found' });
        setPaymentStatus(errorMessage);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onPaymentError(error);
        setPaymentStatus(errorMessage);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
        setPaymentStatus(successMessage);
      } else {
        // Handle unexpected states
        const unexpectedError: StripeError = {
          type: 'unexpected_error',
          message: `Unexpected payment state: ${paymentIntent?.status || 'unknown'}`,
        };
        onPaymentError(unexpectedError);
        setPaymentStatus(errorMessage);
      }
    } catch (error: any) {
      // Explicitly type error as any to access message
      const stripeError: StripeError = {
        type: 'api_error', // Or another appropriate type
        message: error.message || 'An unexpected error occurred.', // Provide a default message
      };
      onPaymentError(stripeError);
      setPaymentStatus(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (event: CardElementChangeEvent) => {
    setDisabled(event.empty || event.error !== undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        onChange={handleChange}
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
          // Add accessibility attributes
          ariaInvalid: true,
          // Adjust placeholder for better UX
          placeholder: 'Enter your card details',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !stripe || isProcessing}
        aria-label="Pay with card"
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {paymentStatus && <div role="alert">{paymentStatus}</div>}
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  publicKey: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, publicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(publicKey);
        if (!stripePromise) {
          throw new Error('Stripe failed to load.');
        }
        setStripePromise(stripePromise);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      } finally {
        setLoading(false);
      }
    };

    loadStripePromise();
  }, [publicKey]);

  if (loadError) {
    return <div>Error loading Stripe. Please check your internet connection and API key.</div>;
  }

  if (loading) {
    return <div>Loading payment gateway...</div>; // More user-friendly loading message
  }

  return stripePromise ? (
    <Elements stripe={stripePromise} options={getStripeElementsOptions()}>
      {children}
    </Elements>
  ) : (
    <div>Payment gateway unavailable.</div>
  );
};

function getStripeElementsOptions(): StripeElementsOptions {
  return {
    locale: 'en',
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
      },
    ],
  };
}

interface StripeIntegrationProps {
  publicKey: string;
  clientSecret: string;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: StripeError) => void;
}

export default function StripeIntegration({
  publicKey,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
}: StripeIntegrationProps) {
  const handlePaymentSuccessCallback = useCallback(
    (paymentIntent: PaymentIntent) => {
      console.log('Payment successful:', paymentIntent);
      onPaymentSuccess(paymentIntent);
    },
    [onPaymentSuccess]
  );

  const handlePaymentErrorCallback = useCallback(
    (error: StripeError) => {
      console.error('Payment error:', error);
      onPaymentError(error);
    },
    [onPaymentError]
  );

  return (
    <StripeProvider publicKey={publicKey}>
      <StripeCheckout
        clientSecret={clientSecret}
        onPaymentSuccess={handlePaymentSuccessCallback}
        onPaymentError={handlePaymentErrorCallback}
      />
    </StripeProvider>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  loadStripe,
  StripeElementsOptions,
  StripeElements,
  StripeError,
  PaymentIntent,
} from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: StripeError) => void;
  clientSecret: string; // Make clientSecret a required prop
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  loadingMessage = 'Processing...',
  successMessage = 'Payment Successful!',
  errorMessage = 'Payment Failed.',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true); // Disable submit until card details are valid
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return; // Prevent multiple submissions
    }

    setIsProcessing(true);
    setPaymentStatus(loadingMessage);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentError({ type: 'validation_error', message: 'Card element not found' });
        setPaymentStatus(errorMessage);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onPaymentError(error);
        setPaymentStatus(errorMessage);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
        setPaymentStatus(successMessage);
      } else {
        // Handle unexpected states
        const unexpectedError: StripeError = {
          type: 'unexpected_error',
          message: `Unexpected payment state: ${paymentIntent?.status || 'unknown'}`,
        };
        onPaymentError(unexpectedError);
        setPaymentStatus(errorMessage);
      }
    } catch (error: any) {
      // Explicitly type error as any to access message
      const stripeError: StripeError = {
        type: 'api_error', // Or another appropriate type
        message: error.message || 'An unexpected error occurred.', // Provide a default message
      };
      onPaymentError(stripeError);
      setPaymentStatus(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (event: CardElementChangeEvent) => {
    setDisabled(event.empty || event.error !== undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        onChange={handleChange}
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
          // Add accessibility attributes
          ariaInvalid: true,
          // Adjust placeholder for better UX
          placeholder: 'Enter your card details',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !stripe || isProcessing}
        aria-label="Pay with card"
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {paymentStatus && <div role="alert">{paymentStatus}</div>}
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  publicKey: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, publicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(publicKey);
        if (!stripePromise) {
          throw new Error('Stripe failed to load.');
        }
        setStripePromise(stripePromise);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      } finally {
        setLoading(false);
      }
    };

    loadStripePromise();
  }, [publicKey]);

  if (loadError) {
    return <div>Error loading Stripe. Please check your internet connection and API key.</div>;
  }

  if (loading) {
    return <div>Loading payment gateway...</div>; // More user-friendly loading message
  }

  return stripePromise ? (
    <Elements stripe={stripePromise} options={getStripeElementsOptions()}>
      {children}
    </Elements>
  ) : (
    <div>Payment gateway unavailable.</div>
  );
};

function getStripeElementsOptions(): StripeElementsOptions {
  return {
    locale: 'en',
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
      },
    ],
  };
}

interface StripeIntegrationProps {
  publicKey: string;
  clientSecret: string;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: StripeError) => void;
}

export default function StripeIntegration({
  publicKey,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
}: StripeIntegrationProps) {
  const handlePaymentSuccessCallback = useCallback(
    (paymentIntent: PaymentIntent) => {
      console.log('Payment successful:', paymentIntent);
      onPaymentSuccess(paymentIntent);
    },
    [onPaymentSuccess]
  );

  const handlePaymentErrorCallback = useCallback(
    (error: StripeError) => {
      console.error('Payment error:', error);
      onPaymentError(error);
    },
    [onPaymentError]
  );

  return (
    <StripeProvider publicKey={publicKey}>
      <StripeCheckout
        clientSecret={clientSecret}
        onPaymentSuccess={handlePaymentSuccessCallback}
        onPaymentError={handlePaymentErrorCallback}
      />
    </StripeProvider>
  );
}