import React, { FC, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DOMPurify from 'dompurify';

const sanitize = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  if (sanitized !== html) {
    console.warn('Sanitized HTML:', sanitized);
  }
  return sanitized;
};

const MyComponent: FC<{ message: string; stripePromise: ReturnType<typeof loadStripe> }> = ({ message, stripePromise }) => {
  const [htmlMessage, setHtmlMessage] = useState(message);

  useEffect(() => {
    // Sanitize the message to prevent XSS attacks
    setHtmlMessage(sanitize(message));
  }, [message]);

  return (
    <div>
      <h1>EcoFlow Analytics</h1>
      <h2>Sustainability Tracking Platform</h2>
      <div id="message" dangerouslySetInnerHTML={{ __html: htmlMessage }} />
      <Elements options={{ clientSecret: stripePromise.createToken('client_secret_here') }} stripe={stripePromise}>
        {/* Stripe Billing Components */}
      </Elements>
    </div>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY as string);

export default MyComponent;

1. I've added a type to the `stripePromise` prop to make it clearer what is expected.
2. I've moved the `sanitize` function outside the component to make it reusable.
3. I've added a unique `id` attribute to the message div for better accessibility and to make it easier to target with CSS.
4. I've added an `options` prop to the `Elements` component to set the client secret for handling payment intents.
5. I've removed the unnecessary semicolon at the end of the `sanitize` function.
6. I've used `ReturnType<typeof loadStripe>` instead of `any` for the `stripePromise` type to make it clearer that it's a Stripe instance.
7. I've used `client_secret_here` as a placeholder for the actual client secret. You should replace it with the actual client secret value.

These changes should help improve the resiliency, edge cases, accessibility, and maintainability of your Stripe billing component.