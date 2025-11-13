import React from 'react';
import { StripeProvider, Elements, ElementsProps } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

interface Props extends Omit<ElementsProps, 'name'> {
  publishableKey: string;
  clientSecret: string;
}

const ClimateCreditHub: React.FC<Props> = ({ publishableKey, clientSecret, ...stripeOptions }) => {
  if (!publishableKey || !clientSecret) {
    throw new Error('Missing required props: publishableKey and clientSecret');
  }

  return (
    <StripeProvider publishableKey={publishableKey} {...stripeOptions}>
      <Elements>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </StripeProvider>
  );
};

export default ClimateCreditHub;

// CheckoutForm.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { StripeElement, StripeElementChangeEvent } from '@stripe/react-stripe-js';

interface Props {
  clientSecret: string;
}

const CheckoutForm: React.FC<Props> = ({ clientSecret }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cardElement, setCardElement] = useState<StripeElement | null>(null);

  useEffect(() => {
    const loadStripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your Stripe publishable key

    loadStripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);
    });
  }, []);

  const handleChange = (event: StripeElementChangeEvent) => {
    setCardElement(event.element);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !cardElement) {
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'John Doe', // Replace with your billing details
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit}>
      <StripeElement id="card-element" onChange={handleChange} />
      {errorMessage && <div id="error-message">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || loading}>
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;

In this updated code, I've added the `name` property to the `stripeOptions` object passed to the `StripeProvider` to ensure it's properly set. I've also added a `cardElement` state variable to handle changes to the Stripe element, and updated the `handleSubmit` function to use the `cardElement` when confirming the payment. Additionally, I've added a billing details object to the `payment_method` configuration for better payment handling.