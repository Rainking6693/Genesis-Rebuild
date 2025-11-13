import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, Stripe, Loader, ElementsConsumer } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props {
  stripePublishableKey: string; // Add stripe publishable key for Stripe Checkout
  customerId?: string; // Add customerId if you want to charge a specific customer
  items: { id: string, name: string, price: number }[]; // Define items for the purchase
  onComplete?: (details: any) => void; // Add callback for handling successful checkout
}

const createStripe = (stripePublishableKey: string) =>
  new Promise((resolve, reject) => {
    const stripePromise = Stripe(stripePublishableKey);
    stripePromise.then(resolve).catch(reject);
  });

const MyComponent: React.FC<Props> = ({ stripePublishableKey, customerId = '', items, onComplete }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    createStripe(stripePublishableKey)
      .then((stripeInstance) => {
        setStripe(stripeInstance);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setLoading(false);
      });
  }, [stripePublishableKey]);

  if (loading) {
    return (
      <div className="loading">
        <Loader />
        <p>Loading Stripe Checkout...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="error">
        <p>Error initializing Stripe Checkout. Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CheckoutForm customerId={customerId} items={items} onComplete={onComplete} />
        <ElementsConsumer>
          {({ elementsReady }) =>
            elementsReady && (
              <div aria-live="polite" className="focus-ring">
                {/* Add focus ring for accessibility */}
              </div>
            )
          }
        </ElementsConsumer>
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, Stripe, Loader, ElementsConsumer } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'; // Assuming you have a CheckoutForm component for Stripe Checkout

interface Props {
  stripePublishableKey: string; // Add stripe publishable key for Stripe Checkout
  customerId?: string; // Add customerId if you want to charge a specific customer
  items: { id: string, name: string, price: number }[]; // Define items for the purchase
  onComplete?: (details: any) => void; // Add callback for handling successful checkout
}

const createStripe = (stripePublishableKey: string) =>
  new Promise((resolve, reject) => {
    const stripePromise = Stripe(stripePublishableKey);
    stripePromise.then(resolve).catch(reject);
  });

const MyComponent: React.FC<Props> = ({ stripePublishableKey, customerId = '', items, onComplete }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    createStripe(stripePublishableKey)
      .then((stripeInstance) => {
        setStripe(stripeInstance);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setLoading(false);
      });
  }, [stripePublishableKey]);

  if (loading) {
    return (
      <div className="loading">
        <Loader />
        <p>Loading Stripe Checkout...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="error">
        <p>Error initializing Stripe Checkout. Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CheckoutForm customerId={customerId} items={items} onComplete={onComplete} />
        <ElementsConsumer>
          {({ elementsReady }) =>
            elementsReady && (
              <div aria-live="polite" className="focus-ring">
                {/* Add focus ring for accessibility */}
              </div>
            )
          }
        </ElementsConsumer>
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;