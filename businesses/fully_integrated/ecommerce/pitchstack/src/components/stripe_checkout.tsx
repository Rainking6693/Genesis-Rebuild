import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, LoadingElement, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  clientSecret: string;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, clientSecret, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripeKey) return;

    const newStripe = Stripe(stripeKey);
    setStripeInstance(newStripe);

    // Ensure Stripe.js is loaded before calling setPublishable
    newStripe.load(() => {
      newStripe.setPublishable(stripeKey);
    });

    // Clean up on component unmount
    return () => {
      newStripe.unload();
    };
  }, [stripeKey]);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripeInstance) return;

    setIsLoading(true);

    try {
      const { error } = await stripeInstance.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div> {/* Add a parent element for accessibility */}
      {isLoading && <LoadingElement />}
      <form onSubmit={handlePayment}>
        <Elements>{children}</Elements>
      </form>
    </div>
  );
};

export default MyComponent;

This version of the component addresses resiliency, edge cases, accessibility, and maintainability by:

1. Using the `useEffect` hook to ensure the Stripe instance is only created once and cleaned up when the component is unmounted.
2. Checking if `stripeInstance` is defined before attempting to redirect to checkout.
3. Using a `LoadingElement` from the Stripe React library to indicate that the payment form is loading.
4. Adding error handling for the `redirectToCheckout` call using a `try-catch` block.
5. Setting `isLoading` to `false` in the `finally` block to ensure it's always reset after the `redirectToCheckout` call, regardless of any errors that may have occurred.
6. Adding accessibility by wrapping the form and loading element in a single parent element.
7. Using TypeScript to ensure proper types for props, state, and event handlers.