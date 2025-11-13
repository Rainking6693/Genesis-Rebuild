import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { Stripe } from 'stripe';

interface StripeCheckoutProps {
  stripePublishableKey: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

interface ErrorElementProps {
  message: string;
}

const ErrorElement: React.FC<ErrorElementProps> = ({ message }) => {
  return <div role="alert">{message}</div>;
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  stripePublishableKey,
  amount,
  currency,
  successUrl,
  cancelUrl,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/${stripePublishableKey}`;
    script.onload = () => {
      setStripe(new Stripe(stripePublishableKey));
    };
    script.onerror = () => {
      setError('Error loading Stripe instance');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [stripePublishableKey]);

  if (!stripe) return <Loader />;

  if (error) return <ErrorElement message={error} />;

  const handleCheckout = async () => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Your Product Name',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      setError('Error during checkout process');
    }
  };

  return (
    <div role="checkout">
      <button type="button" onClick={handleCheckout}>
        Checkout
      </button>
      {/* Add more checkout components here */}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { Stripe } from 'stripe';

interface StripeCheckoutProps {
  stripePublishableKey: string;
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

interface ErrorElementProps {
  message: string;
}

const ErrorElement: React.FC<ErrorElementProps> = ({ message }) => {
  return <div role="alert">{message}</div>;
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  stripePublishableKey,
  amount,
  currency,
  successUrl,
  cancelUrl,
}) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/${stripePublishableKey}`;
    script.onload = () => {
      setStripe(new Stripe(stripePublishableKey));
    };
    script.onerror = () => {
      setError('Error loading Stripe instance');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [stripePublishableKey]);

  if (!stripe) return <Loader />;

  if (error) return <ErrorElement message={error} />;

  const handleCheckout = async () => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Your Product Name',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        payment_method_types: ['card'],
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      setError('Error during checkout process');
    }
  };

  return (
    <div role="checkout">
      <button type="button" onClick={handleCheckout}>
        Checkout
      </button>
      {/* Add more checkout components here */}
    </div>
  );
};