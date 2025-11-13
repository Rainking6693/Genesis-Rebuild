import React, { FC, useEffect, useState } from 'react';
import { StripeProvider, Elements, LoadError, useStripe, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  stripePublishableKey: string;
  options?: Stripe.StripeOptions;
  message: ReactNode;
}

interface StripeErrorProps {
  error: LoadError;
}

const StripeError: FC<StripeErrorProps> = ({ error }) => {
  return <div data-testid="stripe-error">{error.message}</div>;
};

const MyComponent: FC<Props> = ({ stripePublishableKey, options, message }) => {
  const [stripe, setStripe] = useState<Stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoadError | null>(null);

  useEffect(() => {
    loadStripe(stripePublishableKey).then((instance) => {
      setStripe(instance);
      setLoading(false);
    }).catch((err) => {
      setError(err);
      setLoading(false);
    });
  }, [stripePublishableKey]);

  const stripeInstance = useStripe();

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return (
      <div>
        <StripeError error={error} />
        <div data-testid="fallback-ui">Fallback UI</div>
      </div>
    );
  }

  return (
    <StripeProvider options={options}>
      <Elements onReady={(el) => el.complete()} id="stripe-elements">
        <div className="p-4" data-testid="stripe-container">
          <ElementsConsumer>
            {({ elements }) => (
              <>
                <div dangerouslySetInnerHTML={{ __html: message }} />
                {elements && stripeInstance && (
                  <div>{/* Your Stripe elements go here */}</div>
                )}
              </>
            )}
          </ElementsConsumer>
        </div>
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { StripeProvider, Elements, LoadError, useStripe, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  stripePublishableKey: string;
  options?: Stripe.StripeOptions;
  message: ReactNode;
}

interface StripeErrorProps {
  error: LoadError;
}

const StripeError: FC<StripeErrorProps> = ({ error }) => {
  return <div data-testid="stripe-error">{error.message}</div>;
};

const MyComponent: FC<Props> = ({ stripePublishableKey, options, message }) => {
  const [stripe, setStripe] = useState<Stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoadError | null>(null);

  useEffect(() => {
    loadStripe(stripePublishableKey).then((instance) => {
      setStripe(instance);
      setLoading(false);
    }).catch((err) => {
      setError(err);
      setLoading(false);
    });
  }, [stripePublishableKey]);

  const stripeInstance = useStripe();

  if (loading) {
    return <div>Loading Stripe...</div>;
  }

  if (error) {
    return (
      <div>
        <StripeError error={error} />
        <div data-testid="fallback-ui">Fallback UI</div>
      </div>
    );
  }

  return (
    <StripeProvider options={options}>
      <Elements onReady={(el) => el.complete()} id="stripe-elements">
        <div className="p-4" data-testid="stripe-container">
          <ElementsConsumer>
            {({ elements }) => (
              <>
                <div dangerouslySetInnerHTML={{ __html: message }} />
                {elements && stripeInstance && (
                  <div>{/* Your Stripe elements go here */}</div>
                )}
              </>
            )}
          </ElementsConsumer>
        </div>
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;