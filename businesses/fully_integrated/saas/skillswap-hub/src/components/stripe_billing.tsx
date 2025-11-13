import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  options?: Stripe.Options;
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ stripeKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeKey) return;

    let script: HTMLScriptElement | null = document.getElementById('stripe-script');

    if (!script) {
      script = document.createElement('script');
      script.id = 'stripe-script';
      script.src = `https://js.stripe.com/v3/${stripeKey}`;
      script.async = true;

      document.body.appendChild(script);
    }

    script.onload = () => {
      const stripe = (window as any).Stripe;
      setStripeInstance(stripe);
    };

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, [stripeKey]);

  useEffect(() => {
    if (!stripeInstance) return;

    Stripe.setApiKey(stripeKey);

    if (stripeInstance.createClientSecret) {
      stripeInstance.createClientSecret().then((clientSecret) => {
        setOptions({ ...options, clientSecret });
      });
    }
  }, [stripeKey, stripeInstance]);

  const [options, setOptions] = useState<Stripe.Options>({});

  const mergedOptions = { ...options, ...(stripeInstance && { clientSecret: options.clientSecret }) };

  return (
    <div aria-label="Stripe Payment Form">
      <Elements options={mergedOptions}>
        {children}
      </Elements>
    </div>
  );
};

export default MyComponent;

In this updated version, I've added the following improvements:

1. Checked if the Stripe script is already loaded before creating a new one to prevent multiple script loads.

2. Fetched the `clientSecret` only after the Stripe instance is properly initialized to ensure that it's available.

3. Separated the `options` state into two separate states (`stripeInstance` and `options`) to improve maintainability and readability.

4. Added a unique `aria-label` to the wrapping `div` for better screen reader support.

5. Checked if the `clientSecret` is provided in the `options` before setting it on the `mergedOptions` object to handle edge cases where it might not be provided.

6. Used the `any` type for the global Stripe object to avoid potential issues with the Stripe library's global scope.

7. Improved maintainability by separating the Stripe script loading, initialization, and `clientSecret` fetching logic into separate `useEffect` hooks.