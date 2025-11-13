import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, LoadingElement, ElementsProps } from '@stripe/react-stripe-js';

interface Props {
  stripeKey: string;
  checkoutSessionId?: string;
  message?: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  stripeKey,
  checkoutSessionId,
  message,
  onError,
}) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Checkout');
  const [loadingClassName, setLoadingClassName] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutErrorClassName, setCheckoutErrorClassName] = useState('');
  const [checkoutErrorStyle, setCheckoutErrorStyle] = useState({});
  const checkoutButtonRef = useRef<HTMLButtonElement>(null);
  const loadingId = 'stripe-loading';
  const errorId = 'stripe-error';
  const keyboardNavigation = {
    TAB: 9,
    ENTER: 13,
  };

  useEffect(() => {
    if (!stripeKey) return;
    const newStripe = new Stripe(stripeKey);
    setStripeInstance(newStripe);

    // Attach the Stripe instance to the window for easier access in the Stripe Checkout Component
    window.stripe = newStripe;

    // Check if the Checkout Session ID is provided and handle it accordingly
    if (checkoutSessionId) {
      handleCheckout();
    }
  }, [stripeKey, checkoutSessionId]);

  const handleCheckout = async () => {
    if (!stripeInstance) return;

    setIsLoading(true);
    setLoadingMessage('Loading...');
    setLoadingClassName('loading');

    try {
      const session = await stripeInstance.checkout.sessions.create({
        session_id: checkoutSessionId,
      });

      // Redirect to Checkout
      window.location.replace(session.url);
    } catch (error) {
      console.error('Error during checkout:', error);
      setCheckoutError(error.message);
      setCheckoutErrorClassName('error');
      setCheckoutErrorStyle({ color: 'red' });
      onError?.(error);
    } finally {
      setIsLoading(false);
      setLoadingMessage('Checkout');
      setLoadingClassName('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === keyboardNavigation.TAB && event.shiftKey) {
      event.preventDefault();
      focusCheckoutButton();
    }
  };

  const focusCheckoutButton = () => {
    if (checkoutButtonRef.current) {
      checkoutButtonRef.current.focus();
    }
  };

  useEffect(() => {
    focusCheckoutButton();
    return () => {
      if (checkoutButtonRef.current) {
        checkoutButtonRef.current.blur();
      }
    };
  }, []);

  useEffect(() => {
    if (checkoutError) {
      setCheckoutErrorClassName('error');
      setCheckoutErrorStyle({ color: 'red' });
    } else {
      setCheckoutErrorClassName('');
      setCheckoutErrorStyle({});
    }
  }, [checkoutError]);

  const loadingStyle = {
    display: isLoading ? 'block' : 'none',
  };

  const checkoutErrorStyleObj = {
    ...checkoutErrorStyle,
    display: checkoutError ? 'block' : 'none',
  };

  const elementsProps: ElementsProps = {
    loading: isLoading,
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <div id={loadingId} className={loadingClassName} style={loadingStyle}>
        {loadingMessage}
      </div>
      {checkoutError && (
        <div id={errorId} className={checkoutErrorClassName} style={checkoutErrorStyleObj}>
          {checkoutError}
        </div>
      )}
      <button
        ref={checkoutButtonRef}
        onClick={handleCheckout}
        disabled={isLoading}
        aria-label="Checkout"
        aria-labelledby={`${loadingId} ${errorId}`}
        tabIndex={0}
      >
        {isLoading ? 'Loading...' : 'Checkout'}
      </button>
      <Elements stripe={stripeInstance} {...elementsProps}>
        <LoadingElement />
      </Elements>
    </div>
  );
};

export default MyComponent;

This updated code addresses the requested improvements in resiliency, edge cases, accessibility, and maintainability for the Stripe checkout component.