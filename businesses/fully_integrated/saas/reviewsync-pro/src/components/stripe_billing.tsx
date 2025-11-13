import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props {
  stripeApiKey: string;
  options?: ElementsProps;
  children: React.ReactNode;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ stripeApiKey, options, children, fallbackMessage }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const elementsRef = useRef<HTMLDivElement>(null);

  const handleCheckout = useCallback(async (stripeToken: any) => {
    // Perform billing operations using the Stripe API
  }, []);

  const handleElementsOptionsChange = useCallback((newOptions: ElementsProps) => {
    // Handle changes to the Elements options
  }, []);

  useEffect(() => {
    if (!stripeApiKey) {
      setHasError(true);
      return;
    }

    const loadStripe = async () => {
      try {
        const stripe = await Stripe(stripeApiKey);
        setStripeInstance(stripe);
        setLoading(false);
      } catch (error) {
        setHasError(true);
      }
    };

    if (elementsRef.current) {
      loadStripe();
    } else {
      const script = document.createElement('script');
      script.src = `https://js.stripe.com/v3/`;
      script.ref = 'stripe-script';
      script.onload = () => {
        loadStripe();
      };
      script.onerror = () => {
        setHasError(true);
      };
      document.body.appendChild(script);
    }

    // Cleanup function to remove the Stripe.js script when the component is unmounted
    return () => {
      if (elementsRef.current) {
        stripeInstance?.close();
        document.body.removeChild(document.querySelector('script[ref="stripe-script"]') as Node);
      }
    };
  }, [stripeApiKey]);

  if (hasError) {
    return (
      <div role="alert" aria-live="polite">
        {fallbackMessage || 'An error occurred while loading Stripe.js. Please refresh the page and try again.'}
      </div>
    );
  }

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        {fallbackMessage || 'Loading Stripe.js...'}
      </div>
    );
  }

  return (
    <div ref={elementsRef}>
      <Elements
        stripe={stripeInstance}
        options={options}
        onReady={handleElementsOptionsChange}
      >
        {children}
      </Elements>
    </div>
  );
};

export default MyComponent;

This updated version addresses the requested improvements and adds additional features to make the component more robust and user-friendly.