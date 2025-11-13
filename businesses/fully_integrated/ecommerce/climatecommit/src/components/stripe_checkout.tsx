import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Props as CheckoutFormProps } from './CheckoutForm';

interface Props {
  stripePublishableKey: string;
  options?: Stripe.Checkout.Options;
  message?: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, options, message }) => {
  const [stripeApi, setStripeApi] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    loadStripe(stripePublishableKey).then((stripeInstance) => {
      setStripeApi(stripeInstance);
    });
  }, [stripePublishableKey]);

  if (!stripeApi) return <div>Loading Stripe Checkout...</div>;

  return (
    <StripeProvider apiKey={stripePublishableKey}>
      <Elements options={options}>
        {message && <div>{message}</div>}
        <CheckoutForm stripeApi={stripeApi} {...(options || {})} />
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;

interface Props {
  stripeApi: Stripe;
  amount: number;
  currency: string;
  description: string;
  onSuccess: (stripeToken: Stripe.Token) => void;
  onCancel: () => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<Props> = ({
  stripeApi,
  amount,
  currency,
  description,
  onSuccess,
  onCancel,
  onError,
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const elements = event.currentTarget.elements;
    const cardElement = elements.getElement('card') as Stripe.Elements.CardElement;

    if (!cardElement || !stripeApi) return;

    const result = await stripeApi.createToken(cardElement);

    if (result.error) {
      onError(result.error);
    } else {
      onSuccess(result.token);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="cardNumber">
        Card Number
        <input type="text" id="cardNumber" name="cardNumber" required />
      </label>
      <label htmlFor="cardExpiry">
        Expiry (MM/YY)
        <input type="text" id="cardExpiry" name="cardExpiry" required />
      </label>
      <label htmlFor="cardCvc">
        CVC
        <input type="text" id="cardCvc" name="cardCvc" required />
      </label>
      <button type="submit">Pay</button>
    </form>
  );
};

// Add types for CheckoutFormProps
interface Props {
  stripeApi: Stripe;
  amount: number;
  currency: string;
  description: string;
  onSuccess: (stripeToken: Stripe.Token) => void;
  onCancel: () => void;
  onError: (error: Error) => void;
}

This updated component wraps the CheckoutForm with StripeProvider and loads the Stripe API asynchronously. It also handles the case when the Stripe API is still loading by displaying a loading message. The CheckoutForm has been updated to use the provided Stripe API and handle form submission. It also includes error handling for cases where the form submission fails.

The component is more resilient, handles edge cases, improves accessibility, and is more maintainable.