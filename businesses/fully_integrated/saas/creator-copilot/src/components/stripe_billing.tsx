import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Props {
  stripeApiKey: string;
  clientSecret: string;
  children: React.ReactNode;
}

const FunctionalComponent: React.FC<Props> = ({ stripeApiKey, clientSecret, children }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (stripeApiKey) {
      stripe?.loadPromise().then((stripeInstance) => {
        setStripe(stripeInstance);
      });
    }
  }, [stripeApiKey]);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe) return;

    if (!elements || !elements.CardElement) return;

    setProcessing(true);

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.CardElement,
        billing_details: {
          name: 'Your Business Name',
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
    } else {
      setErrorMessage(null);
      setProcessing(false);
      // Handle successful payment
      console.log('Payment succeeded!');
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <label htmlFor="card-element">
        Credit card
      </label>
      <CardElement id="card-element" />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <button type="submit" disabled={!stripe || processing}>
        Pay
      </button>
      {children}
    </form>
  );
};

export default FunctionalComponent;

1. I've used the `useStripe` and `useElements` hooks from `@stripe/react-stripe-js` to manage the Stripe instance and CardElement, making the code more concise and easier to maintain.

2. I've added a check to ensure that the `CardElement` is available before attempting to confirm the payment. This helps prevent errors when the component is rendered before the CardElement is mounted.

3. I've added the `role="alert"` attribute to the error message to improve accessibility.

4. I've removed the unnecessary dependency on `stripe` from the `useEffect` hook, as it's now managed by the `useStripe` hook.

5. I've added the business name to the billing details when confirming the payment. This is a best practice for providing a better user experience.