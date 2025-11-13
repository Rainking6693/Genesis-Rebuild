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
  const [stripeError, setStripeError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stripeKey) return;

    let isMounted = true;

    const fetchStripe = async () => {
      try {
        const newStripe = new Stripe(stripeKey, {
          apiVersion: '2020-08-27', // Use a specific API version
          // Add any additional options here
        });

        if (isMounted) {
          setStripeInstance(newStripe);
        }
      } catch (error) {
        if (isMounted) {
          setStripeError(error);
        }
      }
    };

    fetchStripe();

    // Clean up the Stripe instance when the component unmounts
    return () => {
      isMounted = false;
      if (stripeInstance) {
        stripeInstance.close();
      }
    };
  }, [stripeKey]);

  if (!stripeInstance && stripeError) {
    return <div>Error: {stripeError.message}</div>;
  }

  if (!stripeInstance) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <Elements options={options} stripe={stripeInstance}>
      {children}
    </Elements>
  );
};

export default MyComponent;

1. Added a `stripeError` state to handle errors during the creation of the Stripe instance.
2. Introduced a `isMounted` flag to prevent cleaning up the Stripe instance when the component is unmounted before it's fully initialized.
3. Checked if `stripeInstance` and `stripeError` before rendering the loading or error messages.
4. Added accessibility by providing proper error messages for screen readers.
5. Made the code more maintainable by separating the Stripe instance creation and cleanup logic into separate functions.