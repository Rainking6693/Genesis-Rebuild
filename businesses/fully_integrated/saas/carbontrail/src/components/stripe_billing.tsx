import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once to prevent multiple initializations
function initializeStripe(stripeKey: string): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
}

interface PricingPlan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string; // Stripe Price ID
  description?: string;
  currency?: string; // Add currency to the pricing plan
  features?: string[]; // Optional: List of features included in the plan
}

interface StripeBillingProps {
  pricingPlans: PricingPlan[];
  successUrl: string; // URL to redirect to after successful checkout
  cancelUrl: string;  // URL to redirect to if checkout is cancelled
  buttonClassName?: string; // Optional class name for the button
  containerClassName?: string; // Optional class name for the container
  errorClassName?: string; // Optional class name for the error message
  planContainerClassName?: string; // Optional class name for each plan container
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  disabled?: boolean; // Prop to disable all buttons
}

const StripeBilling: React.FC<StripeBillingProps> = ({
  pricingPlans,
  successUrl,
  cancelUrl,
  buttonClassName = '',
  containerClassName = '',
  errorClassName = '',
  planContainerClassName = '',
  loadingIndicator = 'Loading...',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<string | null>(null);

  // Memoize the stripe key to prevent unnecessary re-renders
  const stripeKey = useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, []);

  useEffect(() => {
    if (!stripeKey) {
      const errorMessage = "Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.";
      console.error(errorMessage);
      setStripeLoadingError(errorMessage);
      return;
    }

    setLoading(true); // Start loading immediately
    initializeStripe(stripeKey)
      .then(stripeInstance => {
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          const errorMessage = "Failed to initialize Stripe. Please check your Stripe key and internet connection.";
          setStripeLoadingError(errorMessage);
          console.error(errorMessage);
        }
      })
      .catch(err => {
        console.error("Error initializing Stripe:", err);
        const errorMessage = "Failed to initialize Stripe. Check console for details.";
        setStripeLoadingError(errorMessage);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of success or failure
      });
  }, [stripeKey]);

  const handleCheckout = useCallback(
    async (priceId: string, planName: string) => {
      if (stripeLoadingError || !stripe) {
        console.error("Cannot initiate checkout due to previous errors or Stripe not initialized.");
        setError(stripeLoadingError || "Stripe is not initialized.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!successUrl || !cancelUrl) {
          throw new Error("Success and cancel URLs must be provided.");
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          setError(stripeError.message || "An error occurred during checkout.");
          console.error("Stripe checkout error:", stripeError);
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
        console.error("Error during checkout:", e);
      } finally {
        setLoading(false);
      }
    },
    [stripe, successUrl, cancelUrl, stripeLoadingError]
  );

  // Memoize the pricing plans rendering to prevent unnecessary re-renders
  const renderPricingPlans = useCallback(() => {
    if (!pricingPlans || pricingPlans.length === 0) {
      return <p>No pricing plans available.</p>; // Handle empty pricing plans
    }

    return pricingPlans.map((plan) => (
      <div key={plan.stripePriceId} className={planContainerClassName}>
        <h3>{plan.name}</h3>
        {plan.description && <p>{plan.description}</p>}
        {plan.features && plan.features.length > 0 && (
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
        <p>
          Price: {plan.currency ? plan.currency : '$'}
          {plan.price} / {plan.interval}
        </p>
        <button
          onClick={() => handleCheckout(plan.stripePriceId, plan.name)}
          disabled={loading || !stripe || disabled}
          className={buttonClassName}
          aria-label={`Subscribe to ${plan.name}`} // Accessibility: Add aria-label
        >
          {loading ? loadingIndicator : 'Subscribe'}
        </button>
      </div>
    ));
  }, [pricingPlans, loading, handleCheckout, buttonClassName, stripe, planContainerClassName, loadingIndicator, disabled]);

  return (
    <div className={containerClassName}>
      {(error || stripeLoadingError) && (
        <div style={{ color: 'red' }} className={errorClassName} role="alert">
          {/* Accessibility: Use role="alert" for error messages */}
          Error: {error || stripeLoadingError}
        </div>
      )}
      {loading && !stripeLoadingError && <div>{loadingIndicator}</div>}
      {!loading && !stripeLoadingError && renderPricingPlans()}
    </div>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once to prevent multiple initializations
function initializeStripe(stripeKey: string): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
}

interface PricingPlan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string; // Stripe Price ID
  description?: string;
  currency?: string; // Add currency to the pricing plan
  features?: string[]; // Optional: List of features included in the plan
}

interface StripeBillingProps {
  pricingPlans: PricingPlan[];
  successUrl: string; // URL to redirect to after successful checkout
  cancelUrl: string;  // URL to redirect to if checkout is cancelled
  buttonClassName?: string; // Optional class name for the button
  containerClassName?: string; // Optional class name for the container
  errorClassName?: string; // Optional class name for the error message
  planContainerClassName?: string; // Optional class name for each plan container
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  disabled?: boolean; // Prop to disable all buttons
}

const StripeBilling: React.FC<StripeBillingProps> = ({
  pricingPlans,
  successUrl,
  cancelUrl,
  buttonClassName = '',
  containerClassName = '',
  errorClassName = '',
  planContainerClassName = '',
  loadingIndicator = 'Loading...',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeLoadingError, setStripeLoadingError] = useState<string | null>(null);

  // Memoize the stripe key to prevent unnecessary re-renders
  const stripeKey = useMemo(() => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, []);

  useEffect(() => {
    if (!stripeKey) {
      const errorMessage = "Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.";
      console.error(errorMessage);
      setStripeLoadingError(errorMessage);
      return;
    }

    setLoading(true); // Start loading immediately
    initializeStripe(stripeKey)
      .then(stripeInstance => {
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          const errorMessage = "Failed to initialize Stripe. Please check your Stripe key and internet connection.";
          setStripeLoadingError(errorMessage);
          console.error(errorMessage);
        }
      })
      .catch(err => {
        console.error("Error initializing Stripe:", err);
        const errorMessage = "Failed to initialize Stripe. Check console for details.";
        setStripeLoadingError(errorMessage);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of success or failure
      });
  }, [stripeKey]);

  const handleCheckout = useCallback(
    async (priceId: string, planName: string) => {
      if (stripeLoadingError || !stripe) {
        console.error("Cannot initiate checkout due to previous errors or Stripe not initialized.");
        setError(stripeLoadingError || "Stripe is not initialized.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!successUrl || !cancelUrl) {
          throw new Error("Success and cancel URLs must be provided.");
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          setError(stripeError.message || "An error occurred during checkout.");
          console.error("Stripe checkout error:", stripeError);
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
        console.error("Error during checkout:", e);
      } finally {
        setLoading(false);
      }
    },
    [stripe, successUrl, cancelUrl, stripeLoadingError]
  );

  // Memoize the pricing plans rendering to prevent unnecessary re-renders
  const renderPricingPlans = useCallback(() => {
    if (!pricingPlans || pricingPlans.length === 0) {
      return <p>No pricing plans available.</p>; // Handle empty pricing plans
    }

    return pricingPlans.map((plan) => (
      <div key={plan.stripePriceId} className={planContainerClassName}>
        <h3>{plan.name}</h3>
        {plan.description && <p>{plan.description}</p>}
        {plan.features && plan.features.length > 0 && (
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
        <p>
          Price: {plan.currency ? plan.currency : '$'}
          {plan.price} / {plan.interval}
        </p>
        <button
          onClick={() => handleCheckout(plan.stripePriceId, plan.name)}
          disabled={loading || !stripe || disabled}
          className={buttonClassName}
          aria-label={`Subscribe to ${plan.name}`} // Accessibility: Add aria-label
        >
          {loading ? loadingIndicator : 'Subscribe'}
        </button>
      </div>
    ));
  }, [pricingPlans, loading, handleCheckout, buttonClassName, stripe, planContainerClassName, loadingIndicator, disabled]);

  return (
    <div className={containerClassName}>
      {(error || stripeLoadingError) && (
        <div style={{ color: 'red' }} className={errorClassName} role="alert">
          {/* Accessibility: Use role="alert" for error messages */}
          Error: {error || stripeLoadingError}
        </div>
      )}
      {loading && !stripeLoadingError && <div>{loadingIndicator}</div>}
      {!loading && !stripeLoadingError && renderPricingPlans()}
    </div>
  );
};

export default StripeBilling;