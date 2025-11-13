import React, { FC, useEffect, useState } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming CheckoutForm is the Stripe Checkout form component

interface Props {
  clientSecret: string;
}

interface State {
  isLoading: boolean;
  error?: Error;
}

const MyComponent: FC<Props> = ({ clientSecret }) => {
  const [state, setState] = useState<State>({ isLoading: true });

  useEffect(() => {
    const handleLoad = () => setState({ isLoading: false });
    const handleError = (err: Error) => {
      setState({ error: err, isLoading: false });
      // Log the error for debugging purposes
      console.error('Stripe Error:', err);
    };

    return () => {
      // Clean up the event listeners when the component unmounts
      document.removeEventListener('stripeInitialize', handleLoad);
      document.removeEventListener('stripeError', handleError);
    };
  }, []);

  useEffect(() => {
    // Initialize Stripe when the component mounts
    const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY as string);
    stripe.initialize().catch((err) => {
      // Handle initialization errors
      console.error('Stripe Initialization Error:', err);
    });

    // Add event listeners for loading and error states
    document.addEventListener('stripeInitialize', handleLoad);
    document.addEventListener('stripeError', handleError);

    return () => {
      // Clean up the event listeners when the component unmounts
      document.removeEventListener('stripeInitialize', handleLoad);
      document.removeEventListener('stripeError', handleError);
    };
  }, []);

  if (state.error) {
    return <div>Error: {state.error.message}</div>;
  }

  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY as string}>
      <Elements options={{ clientSecret }} load={handleLoad} error={handleError}>
        <MyCheckoutContainer isLoading={state.isLoading}>
          <CheckoutForm clientSecret={clientSecret} />
        </MyCheckoutContainer>
      </Elements>
    </StripeProvider>
  );
};

const MyCheckoutContainer: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <div className="stripe-checkout-container">
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div className="checkout-content">
          {/* Your existing MyComponent code */}
          <MyComponent message="Contract Snap Checkout" />
        </div>
      )}
    </div>
  );
};

export default MyComponent;

In this updated code, I've added error logging for initialization and Stripe errors. I've also added a loading indicator and a container for the checkout content to improve accessibility and maintainability. The container and loading indicator are styled with CSS classes for better customization.