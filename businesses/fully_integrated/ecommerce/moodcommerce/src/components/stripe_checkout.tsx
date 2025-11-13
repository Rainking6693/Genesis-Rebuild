import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

interface Props {
  productId: string;
  mood: string;
  userId: string;
}

const MyComponent: React.FC<Props> = ({ productId, mood, userId }) => {
  const [stripeApi, setStripeApi] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePromise) return;

    loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY).then((stripe) => {
      setStripeApi(stripe);
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      setIsLoading(false);
    });

    stripePromise.then((stripe) => {
      const check = stripe.checkout.session.list({ limit: 1 })
        .then(({ data }) => data[0])
        .then((session) => session?.subscription_items?.data[0]?.id);

      check.then((subscriptionId) => {
        if (subscriptionId) {
          setCheckoutSessionId(subscriptionId);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!stripeApi || checkoutSessionId) return;

    const createCheckoutSession = async () => {
      try {
        const checkoutSession = await stripeApi.checkout.session.create({
          customer_email: userId,
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Mood-based Product: ${productId}`,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            mood,
          },
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        });

        setCheckoutSessionId(checkoutSession.id);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    createCheckoutSession();
  }, [stripeApi, productId, mood, userId]);

  if (isLoading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!stripeApi || !checkoutSessionId) {
    return null;
  }

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      <button onClick={() => stripeApi?.redirectToCheckout({ sessionId: checkoutSessionId })}>Checkout</button>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

interface Props {
  productId: string;
  mood: string;
  userId: string;
}

const MyComponent: React.FC<Props> = ({ productId, mood, userId }) => {
  const [stripeApi, setStripeApi] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePromise) return;

    loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY).then((stripe) => {
      setStripeApi(stripe);
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      setIsLoading(false);
    });

    stripePromise.then((stripe) => {
      const check = stripe.checkout.session.list({ limit: 1 })
        .then(({ data }) => data[0])
        .then((session) => session?.subscription_items?.data[0]?.id);

      check.then((subscriptionId) => {
        if (subscriptionId) {
          setCheckoutSessionId(subscriptionId);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!stripeApi || checkoutSessionId) return;

    const createCheckoutSession = async () => {
      try {
        const checkoutSession = await stripeApi.checkout.session.create({
          customer_email: userId,
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Mood-based Product: ${productId}`,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            mood,
          },
          success_url: window.location.origin,
          cancel_url: window.location.origin,
        });

        setCheckoutSessionId(checkoutSession.id);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    createCheckoutSession();
  }, [stripeApi, productId, mood, userId]);

  if (isLoading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!stripeApi || !checkoutSessionId) {
    return null;
  }

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      <button onClick={() => stripeApi?.redirectToCheckout({ sessionId: checkoutSessionId })}>Checkout</button>
    </div>
  );
};

export default MyComponent;