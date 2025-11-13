import React, { FunctionComponent, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeApiKey: string;
  name: string;
}

const FunctionalComponent: FunctionComponent<Props> = ({ stripeApiKey, name, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeApiKey) {
      return <div>Error: Stripe API key is required.</div>;
    }

    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) {
        const newStripe = new Stripe(stripeApiKey);
        setStripeInstance(newStripe);
      }
    }, 5000);

    // Clean up on component unmount
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (stripeInstance) {
        stripeInstance.close();
      }
    };
  }, [stripeApiKey]);

  const handlePayment = async () => {
    try {
      // Add your payment processing logic here
      const result = await stripeInstance?.payments.create({ /* payment details */ });
      if (result.error) {
        // Handle error
        console.error(result.error.message);
      } else {
        // Handle success
        console.log(result);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!stripeInstance) {
    return null;
  }

  return (
    <Elements stripe={stripeInstance}>
      <h1>Welcome, {name}!</h1>
      <button role="button" aria-label="Pay Now" onClick={handlePayment}>Pay Now</button>
      {children}
    </Elements>
  );
};

FunctionalComponent.defaultProps = {
  // Add any default props here
};

export default FunctionalComponent;