import React, { FC, useEffect, useState } from 'react';
import { Stripe, CheckoutSession } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

Stripe.setApiKey(process.env.NEXT_PUBLIC_STRIPE_API_KEY); // Replace with your actual Stripe API key

interface Props {
  message: string;
}

interface CheckoutSessionData {
  id: string | null;
  error: string | null;
}

const StripeCheckout: FC<Props> = ({ message }) => {
  const [stripeSessionData, setStripeSessionData] = useState<CheckoutSessionData>({ id: null, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const createCheckoutSession = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/create-checkout-session'); // Replace with your actual API endpoint
        const data = await response.json();
        setStripeSessionData({ id: data.id, error: null });
      } catch (error) {
        setStripeSessionData({ id: null, error: error.message });
      }

      setIsLoading(false);
    };

    if (!stripeSessionData.id) {
      createCheckoutSession();
    }
  }, [stripeSessionData.id]);

  // Add loading state for user feedback during checkout process
  const loading = isLoading || !stripeSessionData.id;

  // Redirect to Stripe Checkout when session ID is available
  useEffect(() => {
    if (stripeSessionData.id) {
      router.push(`/checkout/${stripeSessionData.id}`);
    }
  }, [stripeSessionData.id]);

  return (
    <div>
      {/* Use a unique ID for each checkout session to prevent conflicts */}
      {!loading && (
        <CheckoutSession id={stripeSessionData.id} />
      )}
      {loading && <div>Loading...</div>}
      {stripeSessionData.error && <div className="error" role="alert">{stripeSessionData.error}</div>}
      {message && <div className="message" role="alert">{message}</div>}
      {stripeSessionData.id && (
        <div className="success" role="alert">
          Checkout session created successfully! Redirecting to Stripe...
        </div>
      )}
    </div>
  );
};

export default StripeCheckout;

import React, { FC, useEffect, useState } from 'react';
import { Stripe, CheckoutSession } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

Stripe.setApiKey(process.env.NEXT_PUBLIC_STRIPE_API_KEY); // Replace with your actual Stripe API key

interface Props {
  message: string;
}

interface CheckoutSessionData {
  id: string | null;
  error: string | null;
}

const StripeCheckout: FC<Props> = ({ message }) => {
  const [stripeSessionData, setStripeSessionData] = useState<CheckoutSessionData>({ id: null, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const createCheckoutSession = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/create-checkout-session'); // Replace with your actual API endpoint
        const data = await response.json();
        setStripeSessionData({ id: data.id, error: null });
      } catch (error) {
        setStripeSessionData({ id: null, error: error.message });
      }

      setIsLoading(false);
    };

    if (!stripeSessionData.id) {
      createCheckoutSession();
    }
  }, [stripeSessionData.id]);

  // Add loading state for user feedback during checkout process
  const loading = isLoading || !stripeSessionData.id;

  // Redirect to Stripe Checkout when session ID is available
  useEffect(() => {
    if (stripeSessionData.id) {
      router.push(`/checkout/${stripeSessionData.id}`);
    }
  }, [stripeSessionData.id]);

  return (
    <div>
      {/* Use a unique ID for each checkout session to prevent conflicts */}
      {!loading && (
        <CheckoutSession id={stripeSessionData.id} />
      )}
      {loading && <div>Loading...</div>}
      {stripeSessionData.error && <div className="error" role="alert">{stripeSessionData.error}</div>}
      {message && <div className="message" role="alert">{message}</div>}
      {stripeSessionData.id && (
        <div className="success" role="alert">
          Checkout session created successfully! Redirecting to Stripe...
        </div>
      )}
    </div>
  );
};

export default StripeCheckout;