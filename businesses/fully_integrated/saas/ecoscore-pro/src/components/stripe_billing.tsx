import React, { FC, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleBilling = async (customerId: string, amount: number) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      // Card Element not found.
      setErrorMessage('Card Element not found.');
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        // Inform the user if there is an error with the card.
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const confirmOptions = {
        // Add your confirm options here
      };

      const paymentIntentResponse = await stripe.confirmCardPayment(paymentMethod.id, {
        payment_method_types: ['card'],
        amount,
        currency: 'usd', // Replace with your currency
        confirm_options,
      });

      if (paymentIntentResponse.error) {
        // Inform the user if there is an error with the payment.
        setErrorMessage(paymentIntentResponse.error.message);
        setLoading(false);
        return;
      }

      if (paymentIntentResponse.paymentIntent.status === 'succeeded') {
        // Handle successful payment
      } else {
        // Handle error or cancellation
      }
    } catch (error) {
      // Handle Stripe API errors
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <CardElement />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <div>{loading ? <p>Processing payment...</p> : message}</div>
    </div>
  );
};

export default MyComponent;

In this updated version, I've added the following improvements:

1. Added a `loading` state variable to indicate whether the payment is being processed.
2. Added the `payment_method_types` parameter to the `stripe.confirmCardPayment` call, ensuring that only card payments are accepted.
3. Added the `currency` parameter to the `stripe.confirmCardPayment` call, allowing you to specify the currency for the payment.
4. Added the `role` attribute to the error message to make it accessible to screen readers.
5. Replaced the `dangerouslySetInnerHTML` usage with a conditional rendering of the loading state and the message.

You can further improve this component by adding more specific error handling, customizing the error messages, and integrating it with your application's design and styling. Additionally, consider adding validation for the `customerId` and `amount` parameters to handle edge cases and ensure data integrity.