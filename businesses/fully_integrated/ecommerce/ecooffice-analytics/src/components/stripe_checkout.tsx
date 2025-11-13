import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, ElementsProps, LoadingElement, ErrorElement } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props {
  publishableKey: string; // Add publishable key from Stripe dashboard
  clientSecret: string; // Add client secret from Stripe API response
}

const EcoOfficeCheckout: React.FC<Props> = ({ publishableKey, clientSecret }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [options, setOptions] = useState<ElementsProps>({ clientSecret });

  useEffect(() => {
    if (publishableKey) {
      const script = document.createElement('script');
      script.src = `https://js.stripe.com/v3/`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const stripeInstance = Stripe(publishableKey);
        setStripe(stripeInstance);
      };
    }
  }, [publishableKey]);

  useEffect(() => {
    if (stripe) {
      setOptions({ ...options, clientSecret });
    }
  }, [stripe, clientSecret]);

  useEffect(() => {
    if (stripe) {
      return () => {
        stripe.close();
      };
    }
    return undefined;
  }, [stripe]);

  return (
    <StripeProvider apiKey={publishableKey}>
      <Elements options={options} stripe={stripe}>
        <CheckoutForm />
        {!stripe && <LoadingElement />}
        <ErrorElement />
      </Elements>
    </StripeProvider>
  );
};

export default EcoOfficeCheckout;

import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, ElementsProps, LoadingElement, ErrorElement } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props {
  publishableKey: string; // Add publishable key from Stripe dashboard
  clientSecret: string; // Add client secret from Stripe API response
}

const EcoOfficeCheckout: React.FC<Props> = ({ publishableKey, clientSecret }) => {
  const [stripe, setStripe] = useState<any>(null);
  const [options, setOptions] = useState<ElementsProps>({ clientSecret });

  useEffect(() => {
    if (publishableKey) {
      const script = document.createElement('script');
      script.src = `https://js.stripe.com/v3/`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const stripeInstance = Stripe(publishableKey);
        setStripe(stripeInstance);
      };
    }
  }, [publishableKey]);

  useEffect(() => {
    if (stripe) {
      setOptions({ ...options, clientSecret });
    }
  }, [stripe, clientSecret]);

  useEffect(() => {
    if (stripe) {
      return () => {
        stripe.close();
      };
    }
    return undefined;
  }, [stripe]);

  return (
    <StripeProvider apiKey={publishableKey}>
      <Elements options={options} stripe={stripe}>
        <CheckoutForm />
        {!stripe && <LoadingElement />}
        <ErrorElement />
      </Elements>
    </StripeProvider>
  );
};

export default EcoOfficeCheckout;