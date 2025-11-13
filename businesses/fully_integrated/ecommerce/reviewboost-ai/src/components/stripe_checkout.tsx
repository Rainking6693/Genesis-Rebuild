import { Stripe, StripeCheckout, StripeElement } from '@stripe/stripe-js';
import { LoaderFunction, MetaFunction, LinksFunction } from '@remix-run/node';
import { json, Link } from '@remix-run/react';
import { useState } from 'react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const meta: MetaFunction = () => {
  return { title: 'Checkout' };
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: '/styles.css' }];
};

export const loader: LoaderFunction = async () => {
  if (!stripe) {
    throw new Error('Stripe API key not found');
  }
  return json({});
};

interface CheckoutProps {
  sessionId: string;
}

const Checkout: React.FC<CheckoutProps> = ({ sessionId }) => {
  const [loading, setLoading] = useState(false);

  const handleSuccess = (result: any) => {
    console.log(result);
    // Redirect to success page or perform other actions
  };

  const handleCancel = (error: any) => {
    console.log(error);
    // Redirect to cancel page or perform other actions
  };

  const handleError = (error: any) => {
    console.log(error);
    // Show error message to user and perform other actions
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <StripeCheckout
          stripe={stripe}
          sessionId={sessionId}
          label="Pay with Stripe"
          // Enable/disable the following options as needed
          billingAddress
          shippingAddress
          token={handleSuccess}
          cancel={handleCancel}
          error={handleError}
        >
          {/* Custom Stripe Checkout UI */}
        </StripeCheckout>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  const sessionId = 'your_session_id'; // Replace with your session ID

  return (
    <div>
      <h1>Checkout</h1>
      <Checkout sessionId={sessionId} />
      <Link to="/">Go back</Link>
    </div>
  );
}

import { Stripe, StripeCheckout, StripeElement } from '@stripe/stripe-js';
import { LoaderFunction, MetaFunction, LinksFunction } from '@remix-run/node';
import { json, Link } from '@remix-run/react';
import { useState } from 'react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const meta: MetaFunction = () => {
  return { title: 'Checkout' };
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: '/styles.css' }];
};

export const loader: LoaderFunction = async () => {
  if (!stripe) {
    throw new Error('Stripe API key not found');
  }
  return json({});
};

interface CheckoutProps {
  sessionId: string;
}

const Checkout: React.FC<CheckoutProps> = ({ sessionId }) => {
  const [loading, setLoading] = useState(false);

  const handleSuccess = (result: any) => {
    console.log(result);
    // Redirect to success page or perform other actions
  };

  const handleCancel = (error: any) => {
    console.log(error);
    // Redirect to cancel page or perform other actions
  };

  const handleError = (error: any) => {
    console.log(error);
    // Show error message to user and perform other actions
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <StripeCheckout
          stripe={stripe}
          sessionId={sessionId}
          label="Pay with Stripe"
          // Enable/disable the following options as needed
          billingAddress
          shippingAddress
          token={handleSuccess}
          cancel={handleCancel}
          error={handleError}
        >
          {/* Custom Stripe Checkout UI */}
        </StripeCheckout>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  const sessionId = 'your_session_id'; // Replace with your session ID

  return (
    <div>
      <h1>Checkout</h1>
      <Checkout sessionId={sessionId} />
      <Link to="/">Go back</Link>
    </div>
  );
}