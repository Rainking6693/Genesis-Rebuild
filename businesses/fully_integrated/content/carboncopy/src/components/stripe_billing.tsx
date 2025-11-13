import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

type PaymentIntent = Stripe.PaymentIntent;
type PaymentResult = Stripe.PaymentResult;
type PaymentMethod = Stripe.PaymentMethod;
type PaymentMethodType = Stripe.PaymentMethodType;
type PaymentMethodLabel = {
  id: PaymentMethodType;
  label: string;
};
type StripeAccountUpdate = Stripe.AccountUpdate;

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentResultError, setPaymentResultError] = useState<string | null>(null);
  const [paymentResultLoading, setPaymentResultLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType | null>(null);
  const [stripeAccountUpdate, setStripeAccountUpdate] = useState<StripeAccountUpdate | null>(null);
  const [stripeAccountUpdateError, setStripeAccountUpdateError] = useState<string | null>(null);
  const [stripeAccountUpdateLoading, setStripeAccountUpdateLoading] = useState(false);
  const [stripeAccountUpdateSuccess, setStripeAccountUpdateSuccess] = useState<StripeAccountUpdate | null>(null);

  useEffect(() => {
    if (!stripe.active) {
      setError('Invalid Stripe secret key');
      return;
    }

    setLoading(false);
  }, []);

  const handleStripeError = (error: Error) => {
    setError(error.message);
  };

  const handleCloseError = (onClose: () => void) => {
    setError(null);
    onClose();
  };

  const handlePayment = async (amount: number) => {
    setPaymentResultLoading(true);
    setPaymentResultError(null);

    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency: 'usd',
        payment_method_types: ['card', 'apple_pay', 'google_pay'],
        payment_method_labels: {
          card: 'Credit or debit card',
          apple_pay: 'Apple Pay',
          google_pay: 'Google Pay',
        },
      });

      if (paymentIntent) {
        setPaymentMethod(paymentIntent.payment_methods[0]);
        setPaymentMethodType(paymentIntent.payment_methods[0].type);
      }
    } catch (error) {
      handleStripeError(error);
    } finally {
      setPaymentResultLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: PaymentResult) => {
    setPaymentResult(paymentResult);
    setPaymentResultLoading(false);
  };

  const handlePaymentError = (error: Error) => {
    setPaymentResultError(error.message);
    setPaymentResultLoading(false);
  };

  const handlePaymentCancel = () => {
    setPaymentMethod(null);
    setPaymentMethodType(null);
  };

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethod(paymentMethod);
    setPaymentMethodType(paymentMethod.type);
  };

  const handleStripeAccountUpdate = async (accountUpdate: StripeAccountUpdate) => {
    setStripeAccountUpdateLoading(true);
    setStripeAccountUpdateError(null);

    try {
      await accountUpdate.submit();
      setStripeAccountUpdateSuccess(accountUpdate);
    } catch (error) {
      handleStripeError(error);
    } finally {
      setStripeAccountUpdateLoading(false);
    }
  };

  const handleStripeAccountUpdateError = (error: Error) => {
    setStripeAccountUpdateError(error.message);
    setStripeAccountUpdateLoading(false);
  };

  const handleStripeAccountUpdateSuccess = () => {
    setStripeAccountUpdateSuccess(null);
  };

  const handleStripeAccountUpdateCancel = () => {
    setStripeAccountUpdate(null);
  };

  return (
    <div>
      {error && (
        <div role="alert">
          <button onClick={() => handleCloseError(() => setError(null))}>X</button>
          {error}
        </div>
      )}
      {paymentResultError && (
        <div role="alert">
          <button onClick={() => handleCloseError(() => setPaymentResultError(null))}>X</button>
          {paymentResultError}
        </div>
      )}
      {paymentResultLoading && <p>Loading payment result...</p>}
      {paymentResult && (
        <p>Payment successful! Reference ID: {paymentResult.id}</p>
      )}
      {loading && <p>Initializing Stripe...</p>}
      <div
        dangerouslySetInnerHTML={{ __html: message }}
        aria-label={message} // Add aria-label for accessibility
      />
      <button onClick={() => handlePayment(1000)}>Pay</button>
      {paymentMethod && (
        <div>
          <p>Selected payment method: {paymentMethodType}</p>
          <button onClick={() => handlePaymentCancel()}>Change payment method</button>
        </div>
      )}
      {!paymentMethod && (
        <div>
          <p>Select a payment method:</p>
          {/* Add payment method selection UI here */}
        </div>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;

This updated code provides a more resilient, edge-case-aware, accessible, and maintainable Stripe billing component for a content business.