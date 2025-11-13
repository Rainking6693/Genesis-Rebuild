import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface Props {
  stripePublishableKey: string;
  message: string;
  clientSecret?: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, message, clientSecret }) => {
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    loadStripe(stripePublishableKey).then((stripeInstance) => {
      setStripe(stripeInstance);
    });
  }, [stripePublishableKey]);

  const handleStripePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !clientSecret) return;

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: event.currentTarget.elements.cardElement,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      // Show error to your customer
    } else {
      // Your customer will be redirected to your `success_url` in most cases
    }
  };

  return (
    <>
      <div>{message}</div>
      {stripe && (
        <div>
          <Elements stripe={stripe}>
            <form id="payment-form" onSubmit={handleStripePayment}>
              <label htmlFor="cardElement">
                Credit card
                <StripeCardElement id="cardElement" />
              </label>
              <button type="submit" disabled={!stripe}>
                Pay
              </button>
            </form>
          </Elements>
        </div>
      )}
    </>
  );
};

// StripeCardElement is a custom component for the card element
// You can find the implementation of StripeCardElement in the Stripe.js documentation

export default MyComponent;