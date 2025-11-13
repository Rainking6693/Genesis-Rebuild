import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  message: string;
  ariaLabelMessage?: string;
}

const MyComponent: React.FC<Props> = ({ stripeKey, message, ariaLabelMessage = 'Stripe message', children, ...rest }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripeKey) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/${stripeKey}`;
    script.async = true;
    script.defer = true; // Add this to ensure the script doesn't block rendering

    document.body.appendChild(script);

    script.onload = () => {
      const stripe = (window as any).Stripe;
      setStripeInstance(stripe);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [stripeKey]);

  if (!stripeInstance) {
    return <div aria-label={ariaLabelMessage}>Loading Stripe...</div>;
  }

  return (
    <Elements options={{ stripe: stripeInstance }} {...rest}>
      <div aria-label={ariaLabelMessage}>{message}</div>
      {children}
    </Elements>
  );
};

export default MyComponent;

In this version, I've added the `defer` attribute to the script tag to ensure it doesn't block rendering. I've also added an optional `ariaLabelMessage` prop for better accessibility. The rest props (`...rest`) are still passed to the `Elements` component for further customization.