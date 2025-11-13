import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements, StripeCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  publishableKey: string;
  children: React.ReactNode;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const loadStripeInstance = (stripePromise: any) => {
  return stripePromise.then((stripeInstance) => stripeInstance);
};

const MyCheckoutComponent: React.FC<Props> = ({ publishableKey, children }) => {
  const [stripeApi, setStripeApi] = React.useState<Stripe | null>(null);

  const loadStripeAndSetApi = () => {
    if (stripePromise) {
      loadStripeInstance(stripePromise).then((stripeInstance) => setStripeApi(stripeInstance));
    }
  };

  useEffect(() => {
    loadStripeAndSetApi();
  }, [stripePromise]);

  if (!stripeApi) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <StripeProvider stripe={stripeApi}>
      <Elements>
        {children}
      </Elements>
    </StripeProvider>
  );
};

MyCheckoutComponent.defaultProps = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
};

interface CheckoutProps {
  message: string;
}

const Checkout: React.FC<CheckoutProps> = ({ message }) => {
  const [loading, setLoading] = React.useState(false);
  const [stripeError, setStripeError] = React.useState<Error | null>(null);

  const handleStripeResponse = (stripeToken: any) => {
    // Handle the Stripe token here, e.g., send it to your server for processing
  };

  const handleStripeError = (error: Error) => {
    setStripeError(error);
  };

  const handleClose = () => {
    setStripeError(null);
  };

  const handleToken = (token: any) => {
    setLoading(true);
    handleStripeResponse(token);
  };

  return (
    <StripeCheckout
      name="CreatorCRM"
      description={message}
      amount={1000} // Amount in cents
      currency="USD"
      loading={loading}
      error={stripeError}
      onClose={handleClose}
      onToken={handleToken}
      onError={handleStripeError}
      aria-label="Checkout"
      data-testid="stripe-checkout"
    />
  );
};

const MyComponent: React.FC<CheckoutProps> = ({ message }) => {
  return (
    <MyCheckoutComponent>
      <Checkout message={message} />
    </MyCheckoutComponent>
  );
};

export default MyComponent;

In this version, I've added an `onToken` prop to the `StripeCheckout` component, which is used to handle the Stripe token when the user completes the checkout process. I've also added ARIA labels and data-testid attributes for improved accessibility and testing. Additionally, I've separated the logic for loading the Stripe instance and handling the Stripe token into separate functions, making the code more maintainable.