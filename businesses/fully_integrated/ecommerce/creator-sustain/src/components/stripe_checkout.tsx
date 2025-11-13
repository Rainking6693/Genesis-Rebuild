import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps, StripeElement, StripeError } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  name: string;
  productId: string;
  amount: number;
}

const CheckoutForm: FC<Props> = ({ stripeKey, name, productId, amount, ...elementsProps }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState<StripeError | null>(null);

  useEffect(() => {
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27', // Use a specific API version
    });

    setStripeInstance(stripe);

    // Clean up by setting stripeInstance to null when the component unmounts
    return () => {
      setStripeInstance(null);
    };
  }, [stripeKey]);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripeInstance) {
      setStripeError(new Error('Stripe instance not available'));
      return;
    }

    try {
      const { error } = await stripeInstance.redirectToCheckout({
        lineItems: [{ price_data: { product_data: { name: productId }, unit_amount: amount * 100 } }],
        mode: 'payment',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

      if (error) {
        setStripeError(error);
      }
    } catch (error) {
      setStripeError(error);
    }
  };

  return (
    <Elements {...elementsProps} stripe={stripeInstance}>
      <form onSubmit={handlePayment}>
        <button type="submit" disabled={!!stripeError}>
          {stripeError ? 'Error: ' + stripeError.message : 'Buy Sustainable Product'}
        </button>
        {stripeError && <div role="alert">{stripeError.message}</div>}
      </form>
      <StripeElement id="cardElement" />
    </Elements>
  );
};

export default CheckoutForm;

In this updated version, I've added error handling for the Stripe instance and the redirectToCheckout call. I've also added a `StripeError` state to store any errors that occur during the payment process. The button now displays an error message if one occurs, and I've added a `StripeElement` for handling card payments. Additionally, I've added a `disabled` attribute to the button to prevent multiple submissions when an error occurs. Lastly, I've added role="alert" to the error message div for better accessibility.