import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once, outside the component, to prevent unnecessary re-initializations
function initializeStripe(stripeKey: string | undefined | null): Promise<Stripe | null> {
  if (!stripeKey) {
    console.warn("Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set.");
    return Promise.resolve(null); // Resolve with null to avoid blocking the component
  }

  try {
    return loadStripe(stripeKey);
  } catch (error) {
    console.error("Error loading Stripe:", error);
    return Promise.resolve(null);
  }
}

interface PricingPlan {
  name: string;
  price: string;
  stripePriceId: string; // Stripe Price ID
  description: string;
}

interface StripeBillingProps {
  pricingPlans: PricingPlan[];
  successUrl: string; // URL to redirect to on successful checkout
  cancelUrl: string;  // URL to redirect to on cancelled checkout
  className?: string; // Optional class name for the container
}

const StripeBilling: React.FC<StripeBillingProps> = ({ pricingPlans, successUrl, cancelUrl, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  useEffect(() => {
    isMounted.current = true; // Set to true when the component mounts

    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeKey) {
      setError("Stripe publishable key is missing. Please set the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.");
      return;
    }

    stripePromise = initializeStripe(stripeKey);

    stripePromise.then(stripeInstance => {
      if (isMounted.current) { // Check if the component is still mounted
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError("Failed to initialize Stripe. Check console for warnings.");
        }
      }
    });

    return () => {
      isMounted.current = false; // Set to false when the component unmounts
    };
  }, []);

  // Use useCallback to memoize the handleCheckout function
  const handleCheckout = useCallback(
    async (priceId: string) => {
      if (loading) return;
      setLoading(true);
      setError(null);

      if (!stripe) {
        setError("Stripe has not been initialized. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          console.error("Stripe checkout error:", stripeError);
          setError(stripeError.message || "Failed to redirect to checkout.");
        }
      } catch (err: any) {
        console.error("Error during checkout:", err);
        setError("An unexpected error occurred during checkout.");
      } finally {
        if (isMounted.current) { // Check if the component is still mounted
          setLoading(false);
        }
      }
    },
    [stripe, successUrl, cancelUrl, loading]
  );

  if (error) {
    return (
      <div className="error" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`pricing-container ${className || ''}`}>
      <h2>Choose Your EcoShift AI Plan</h2>
      <div className="pricing-plans">
        {pricingPlans.map((plan) => (
          <div key={plan.stripePriceId} className="pricing-plan">
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <p className="description">{plan.description}</p>
            <button
              onClick={() => handleCheckout(plan.stripePriceId)}
              disabled={loading || !stripe}
              aria-label={`Subscribe to ${plan.name} plan`}
            >
              {loading ? 'Loading...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define a type for the Stripe promise to avoid potential type issues
let stripePromise: Promise<Stripe | null>;

// Initialize stripePromise only once, outside the component, to prevent unnecessary re-initializations
function initializeStripe(stripeKey: string | undefined | null): Promise<Stripe | null> {
  if (!stripeKey) {
    console.warn("Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set.");
    return Promise.resolve(null); // Resolve with null to avoid blocking the component
  }

  try {
    return loadStripe(stripeKey);
  } catch (error) {
    console.error("Error loading Stripe:", error);
    return Promise.resolve(null);
  }
}

interface PricingPlan {
  name: string;
  price: string;
  stripePriceId: string; // Stripe Price ID
  description: string;
}

interface StripeBillingProps {
  pricingPlans: PricingPlan[];
  successUrl: string; // URL to redirect to on successful checkout
  cancelUrl: string;  // URL to redirect to on cancelled checkout
  className?: string; // Optional class name for the container
}

const StripeBilling: React.FC<StripeBillingProps> = ({ pricingPlans, successUrl, cancelUrl, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  useEffect(() => {
    isMounted.current = true; // Set to true when the component mounts

    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeKey) {
      setError("Stripe publishable key is missing. Please set the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.");
      return;
    }

    stripePromise = initializeStripe(stripeKey);

    stripePromise.then(stripeInstance => {
      if (isMounted.current) { // Check if the component is still mounted
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError("Failed to initialize Stripe. Check console for warnings.");
        }
      }
    });

    return () => {
      isMounted.current = false; // Set to false when the component unmounts
    };
  }, []);

  // Use useCallback to memoize the handleCheckout function
  const handleCheckout = useCallback(
    async (priceId: string) => {
      if (loading) return;
      setLoading(true);
      setError(null);

      if (!stripe) {
        setError("Stripe has not been initialized. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const { error: stripeError } = await stripe.redirectToCheckout({
          mode: 'subscription',
          lineItems: [{ price: priceId, quantity: 1 }],
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        });

        if (stripeError) {
          console.error("Stripe checkout error:", stripeError);
          setError(stripeError.message || "Failed to redirect to checkout.");
        }
      } catch (err: any) {
        console.error("Error during checkout:", err);
        setError("An unexpected error occurred during checkout.");
      } finally {
        if (isMounted.current) { // Check if the component is still mounted
          setLoading(false);
        }
      }
    },
    [stripe, successUrl, cancelUrl, loading]
  );

  if (error) {
    return (
      <div className="error" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`pricing-container ${className || ''}`}>
      <h2>Choose Your EcoShift AI Plan</h2>
      <div className="pricing-plans">
        {pricingPlans.map((plan) => (
          <div key={plan.stripePriceId} className="pricing-plan">
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <p className="description">{plan.description}</p>
            <button
              onClick={() => handleCheckout(plan.stripePriceId)}
              disabled={loading || !stripe}
              aria-label={`Subscribe to ${plan.name} plan`}
            >
              {loading ? 'Loading...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StripeBilling;