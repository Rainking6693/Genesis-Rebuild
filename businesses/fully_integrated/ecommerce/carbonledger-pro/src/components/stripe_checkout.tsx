import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, ElementsProps, Stripe, LoadingElement } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props extends Omit<ElementsProps, 'apiKey'> {
  stripePublishableKey: string; // Add stripe publishable key for secure payment processing
  customerId?: string; // If you have a customerId, use it for recurring subscriptions
  email: string; // Customer's email for receipt and communication purposes
  businessName: string; // Business name for receipt and communication purposes
}

const CarbonLedgerProCheckout: React.FC<Props> = ({ stripePublishableKey, customerId, email, businessName, ...elementsProps }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripePublishableKey) {
      throw new Error('Stripe publishable key is not set');
    }

    // Initialize Stripe when the component mounts
    const initStripe = async () => {
      setIsLoading(true);
      const stripeInstance = await Stripe(stripePublishableKey);
      setStripe(stripeInstance);
      setIsLoading(false);
    };

    if (!stripe) {
      initStripe();
    }
  }, [stripePublishableKey]);

  if (isLoading) {
    return <LoadingElement />;
  }

  return (
    <StripeProvider apiKey={stripePublishableKey} stripe={stripe}>
      <Elements {...elementsProps}>
        <CheckoutForm email={email} businessName={businessName} customerId={customerId} stripe={stripe} />
      </Elements>
    </StripeProvider>
  );
};

CarbonLedgerProCheckout.defaultProps = {
  // Set default props for the component
  locale: 'auto',
};

export default CarbonLedgerProCheckout;

import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, ElementsProps, Stripe, LoadingElement } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props extends Omit<ElementsProps, 'apiKey'> {
  stripePublishableKey: string; // Add stripe publishable key for secure payment processing
  customerId?: string; // If you have a customerId, use it for recurring subscriptions
  email: string; // Customer's email for receipt and communication purposes
  businessName: string; // Business name for receipt and communication purposes
}

const CarbonLedgerProCheckout: React.FC<Props> = ({ stripePublishableKey, customerId, email, businessName, ...elementsProps }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripePublishableKey) {
      throw new Error('Stripe publishable key is not set');
    }

    // Initialize Stripe when the component mounts
    const initStripe = async () => {
      setIsLoading(true);
      const stripeInstance = await Stripe(stripePublishableKey);
      setStripe(stripeInstance);
      setIsLoading(false);
    };

    if (!stripe) {
      initStripe();
    }
  }, [stripePublishableKey]);

  if (isLoading) {
    return <LoadingElement />;
  }

  return (
    <StripeProvider apiKey={stripePublishableKey} stripe={stripe}>
      <Elements {...elementsProps}>
        <CheckoutForm email={email} businessName={businessName} customerId={customerId} stripe={stripe} />
      </Elements>
    </StripeProvider>
  );
};

CarbonLedgerProCheckout.defaultProps = {
  // Set default props for the component
  locale: 'auto',
};

export default CarbonLedgerProCheckout;