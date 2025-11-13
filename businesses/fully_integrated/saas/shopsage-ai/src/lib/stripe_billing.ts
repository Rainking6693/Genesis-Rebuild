import React, { FC, useEffect, useRef } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { logError } from '../../utils/logging';
import { useStripe } from '@stripe/react-stripe-js';

interface Props {
  message: string;
}

const StripeBillingMessage: FC<Props> = ({ message }) => {
  const stripe = useStripe();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripe && messageRef.current && stripe.elements) {
      stripe.elements().forEach((element) => {
        if (element._isMounted && element.classList.contains('stripe-billing-message')) {
          element.unmount();
        }
      });
    }
  }, [stripe]);

  useEffect(() => {
    if (stripe && messageRef.current) {
      if (stripe.elements) {
        stripe.elements().forEach((element) => {
          if (!element._isMounted || !element.classList.contains('stripe-billing-message')) return;
          element.unmount();
        });
      }
      const stripeElement = stripe.create('div', {
        className: 'stripe-billing-message',
      });
      stripeElement.mount(messageRef.current);
    }
  }, [stripe, message]);

  return <div key={message} ref={messageRef} className="stripe-billing-message">{message}</div>;
};

const StripeBillingMessageWithErrorBoundary = (props: Props) => {
  const { resetErrorBoundary, error } = useErrorBoundary();

  if (error) {
    // Log the error and reset the error boundary
    if (error && stripe) logError(error, stripe);
    resetErrorBoundary();
  }

  return <StripeBillingMessage {...props} />;
};

export { StripeBillingMessageWithErrorBoundary };

import React, { FC, useEffect, useRef } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { logError } from '../../utils/logging';
import { useStripe } from '@stripe/react-stripe-js';

interface Props {
  message: string;
}

const StripeBillingMessage: FC<Props> = ({ message }) => {
  const stripe = useStripe();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripe && messageRef.current && stripe.elements) {
      stripe.elements().forEach((element) => {
        if (element._isMounted && element.classList.contains('stripe-billing-message')) {
          element.unmount();
        }
      });
    }
  }, [stripe]);

  useEffect(() => {
    if (stripe && messageRef.current) {
      if (stripe.elements) {
        stripe.elements().forEach((element) => {
          if (!element._isMounted || !element.classList.contains('stripe-billing-message')) return;
          element.unmount();
        });
      }
      const stripeElement = stripe.create('div', {
        className: 'stripe-billing-message',
      });
      stripeElement.mount(messageRef.current);
    }
  }, [stripe, message]);

  return <div key={message} ref={messageRef} className="stripe-billing-message">{message}</div>;
};

const StripeBillingMessageWithErrorBoundary = (props: Props) => {
  const { resetErrorBoundary, error } = useErrorBoundary();

  if (error) {
    // Log the error and reset the error boundary
    if (error && stripe) logError(error, stripe);
    resetErrorBoundary();
  }

  return <StripeBillingMessage {...props} />;
};

export { StripeBillingMessageWithErrorBoundary };