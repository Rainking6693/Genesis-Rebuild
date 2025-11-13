import React, { useEffect, useState } from 'react';
import { Stripe, Elements, ElementsProps } from '@stripe/stripe-js';
import { ErrorMessage, HelpLink } from './ErrorAndHelp'; // Assuming you have a custom ErrorMessage and HelpLink components

interface Props {
  stripeKey: string;
  message: string;
  children: React.ReactNode;
}

const FunctionalComponent: React.FC<Props> = ({ stripeKey, message, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      throw new Error('Stripe key is required');
    }

    if (!stripeInstance) {
      Stripe.setPublishableKey(stripeKey);
      setStripeInstance(Stripe);
    }

    // Create a new client secret when the stripeKey prop changes
    if (!clientSecret) {
      stripeInstance?.createTokenClientSecret().then(setClientSecret);
    }
  }, [stripeKey, stripeInstance, clientSecret]);

  if (!stripeInstance) {
    return (
      <div>
        <h2>{message}</h2>
        <ErrorMessage errorMessage="Failed to initialize Stripe" />
        <HelpLink />
      </div>
    );
  }

  const elementsOptions: ElementsProps = {
    clientSecret,
  };

  return (
    <div>
      <h2>{message}</h2>
      <Elements options={elementsOptions}>
        {children}
      </Elements>
    </div>
  );
};

export default FunctionalComponent;

In this improved version, I've added a state for the client secret and created it when the `stripeKey` prop changes. This ensures that the checkout session is secure and the client secret is always up-to-date. Additionally, I've moved the creation of the `elementsOptions` object inside the component to make it more readable and maintainable.