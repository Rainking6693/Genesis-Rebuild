import React, { FC, Key, memo } from 'react';
import { Stripe } from '@stripe/stripe-js';

// Define a custom type for StripeError
interface StripeError {
  message: string;
  type: string;
}

// Component for displaying Stripe errors
interface Props {
  error: StripeError;
}

const StripeError: FC<Props> = ({ error }) => {
  return (
    <div role="alert" aria-label="Stripe Error">
      <strong>Error:</strong> {error.message} (Type: {error.type})
    </div>
  );
};

// Component for displaying a message with optional error
interface Props {
  message: ReactNode;
  error?: StripeError;
  key?: Key;
}

const Message: FC<Props> = ({ message, error, key }) => {
  if (error) {
    return <StripeError key={error.message} error={error} />;
  }

  return <div key={message} role="alert" aria-label="Message">{message}</div>;
};

// Component for displaying Stripe billing messages
interface Props {
  stripeBillingMessage?: string;
  stripeError?: StripeError;
}

const StripeBillingMessage: FC<Props> = ({ stripeBillingMessage, stripeError }) => {
  return <Message message={stripeBillingMessage} error={stripeError} />;
};

// Component for displaying Review Rocket specific messages
interface Props {
  reviewRocketMessage?: string;
  reviewRocketError?: StripeError;
}

const ReviewRocketMessage: FC<Props> = ({ reviewRocketMessage, reviewRocketError }) => {
  return <Message message={reviewRocketMessage} error={reviewRocketError} />;
};

// Component for displaying Stripe billing messages
const StripeBillingMessageMemo = memo(StripeBillingMessage);

// Component for displaying Review Rocket specific messages
const ReviewRocketMessageMemo = memo(ReviewRocketMessage);

export { StripeBillingMessageMemo, ReviewRocketMessageMemo };