// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: () => void; // Callback for successful payment
  onError: (error: string) => void; // Callback for payment error
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual publishable key
        setStripePromise(stripe);

        // Create PaymentIntent as soon as the page loads
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        });

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          onError("Failed to create PaymentIntent: " + data.error);
        }
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        onError("Error initializing Stripe: " + error.message);
      }
    };

    initializeStripe();
  }, [amount, currency, onError]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="StripeCheckout">
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm onSuccess={onSuccess} onError={onError} />
        </Elements>
      )}
      {!clientSecret && <p>Loading...</p>}
    </div>
  );
};

const CheckoutForm: React.FC<{ onSuccess: () => void; onError: (error: string) => void; }> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      setErrorMessage("An unexpected error occurred.");
      onError("An unexpected error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements} className="StripeCheckout__button">
        {isLoading ? "Loading..." : "Pay now"}
      </button>
      {errorMessage && <div className="StripeCheckout__error">{errorMessage}</div>}
    </form>
  );
};

export default StripeCheckout;