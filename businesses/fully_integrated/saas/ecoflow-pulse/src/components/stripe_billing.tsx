import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define a type for the Stripe object to avoid using `any`
interface Stripe {
  elements: (options?: any) => stripe.elements.Elements;
  confirmPayment: (options: any) => Promise<stripe.PaymentIntentResult>;
}

interface BillingDetails {
  planName: string;
  price: number;
  currency: string;
  interval: string; // e.g., "month", "year"
}

interface StripeBillingProps {
  customerEmail: string;
  billingDetails: BillingDetails;
  onSubscriptionSuccess: () => void;
  onSubscriptionError: (error: string) => void;
  returnUrl?: string; // Optional: Allow overriding the return URL
}

const StripeBilling: React.FC<StripeBillingProps> = ({
  customerEmail,
  billingDetails,
  onSubscriptionSuccess,
  onSubscriptionError,
  returnUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<stripe.elements.Elements | null>(null);
  const [paymentElement, setPaymentElement] = useState<stripe.elements.PaymentElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false); // Track Stripe readiness
  const paymentElementRef = useRef<HTMLDivElement>(null); // Ref for the payment element container
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Use useCallback to memoize the fetchClientSecret function
  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
          billingDetails: billingDetails,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
          throw new Error(`Failed to create subscription: HTTP ${response.status}`);
        }
        const errorMessage = errorData?.error || `Failed to create subscription: HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error("Client secret is missing from the response.");
      }
      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (error: any) {
      console.error("Error fetching client secret:", error);
      const message = error.message || "Failed to fetch client secret.";
      setErrorMessage(message);
      onSubscriptionError(message);
      throw error; // Re-throw the error to prevent further execution in initializeStripe
    }
  }, [customerEmail, billingDetails, onSubscriptionError]);

  useEffect(() => {
    const initializeStripe = async () => {
      setLoading(true); // Start loading immediately
      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          throw new Error("Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.");
        }

        // Use the Stripe global object from the window
        if (typeof window === 'undefined' || typeof Stripe === 'undefined') {
          console.warn("Stripe.js not loaded. Ensure it's included in your HTML.");
          throw new Error("Stripe.js not loaded.");
        }

        const stripeInstance = Stripe(publishableKey) as Stripe;

        if (!stripeInstance) {
          throw new Error("Stripe initialization failed. Check your publishable key and network connection.");
        }

        setStripe(stripeInstance);

        const secret = await fetchClientSecret();

        const elementsInstance = stripeInstance.elements({ clientSecret: secret });

        setElements(elementsInstance);

        const paymentElementInstance = elementsInstance.create('payment');
        setPaymentElement(paymentElementInstance);

        // Use the ref to mount the payment element
        if (paymentElementRef.current) {
          paymentElementInstance.mount(paymentElementRef.current);
        } else {
          console.warn("Payment element container not found.  Ensure the element with id 'payment-element' is rendered.");
          throw new Error("Payment element container not found.");
        }

        setIsStripeReady(true); // Stripe is ready after successful initialization
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        const message = error.message || "Failed to initialize Stripe.";
        setErrorMessage(message);
        onSubscriptionError(message);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();

    return () => {
      paymentElement?.unmount();
    };
  }, [fetchClientSecret]); // Add fetchClientSecret as a dependency

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      const message = "Stripe.js has not loaded yet or client secret is missing. Please try again.";
      setErrorMessage(message);
      onSubscriptionError(message);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/subscription-success`,
        },
        redirect: "if_required" // Handle SCA redirects
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        let message = error.message || "Payment failed.";
        if (error.type === 'card_error' || error.type === 'validation_error') {
          message = error.message; // Use Stripe's specific error message
        }
        setErrorMessage(message);
        onSubscriptionError(message);
      } else {
        //  After handling the redirect, PaymentIntent.status is checked server-side.
        onSubscriptionSuccess();
      }
    } catch (error: any) {
      console.error("Error during payment confirmation:", error);
      const message = error.message || "An unexpected error occurred.";
      setErrorMessage(message);
      onSubscriptionError(message);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading ? 'Processing...' : 'Subscribe';
  const isButtonDisabled = loading || !stripe || !elements || !isStripeReady || !clientSecret;

  return (
    <form onSubmit={handleSubmit} aria-label="Subscription form">
      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
      <div id="payment-element" ref={paymentElementRef} aria-live="polite" aria-atomic="true" />
      <button
        type="submit"
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default StripeBilling;

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define a type for the Stripe object to avoid using `any`
interface Stripe {
  elements: (options?: any) => stripe.elements.Elements;
  confirmPayment: (options: any) => Promise<stripe.PaymentIntentResult>;
}

interface BillingDetails {
  planName: string;
  price: number;
  currency: string;
  interval: string; // e.g., "month", "year"
}

interface StripeBillingProps {
  customerEmail: string;
  billingDetails: BillingDetails;
  onSubscriptionSuccess: () => void;
  onSubscriptionError: (error: string) => void;
  returnUrl?: string; // Optional: Allow overriding the return URL
}

const StripeBilling: React.FC<StripeBillingProps> = ({
  customerEmail,
  billingDetails,
  onSubscriptionSuccess,
  onSubscriptionError,
  returnUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<stripe.elements.Elements | null>(null);
  const [paymentElement, setPaymentElement] = useState<stripe.elements.PaymentElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false); // Track Stripe readiness
  const paymentElementRef = useRef<HTMLDivElement>(null); // Ref for the payment element container
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Use useCallback to memoize the fetchClientSecret function
  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
          billingDetails: billingDetails,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
          throw new Error(`Failed to create subscription: HTTP ${response.status}`);
        }
        const errorMessage = errorData?.error || `Failed to create subscription: HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error("Client secret is missing from the response.");
      }
      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (error: any) {
      console.error("Error fetching client secret:", error);
      const message = error.message || "Failed to fetch client secret.";
      setErrorMessage(message);
      onSubscriptionError(message);
      throw error; // Re-throw the error to prevent further execution in initializeStripe
    }
  }, [customerEmail, billingDetails, onSubscriptionError]);

  useEffect(() => {
    const initializeStripe = async () => {
      setLoading(true); // Start loading immediately
      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          throw new Error("Stripe publishable key is missing. Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your environment variables.");
        }

        // Use the Stripe global object from the window
        if (typeof window === 'undefined' || typeof Stripe === 'undefined') {
          console.warn("Stripe.js not loaded. Ensure it's included in your HTML.");
          throw new Error("Stripe.js not loaded.");
        }

        const stripeInstance = Stripe(publishableKey) as Stripe;

        if (!stripeInstance) {
          throw new Error("Stripe initialization failed. Check your publishable key and network connection.");
        }

        setStripe(stripeInstance);

        const secret = await fetchClientSecret();

        const elementsInstance = stripeInstance.elements({ clientSecret: secret });

        setElements(elementsInstance);

        const paymentElementInstance = elementsInstance.create('payment');
        setPaymentElement(paymentElementInstance);

        // Use the ref to mount the payment element
        if (paymentElementRef.current) {
          paymentElementInstance.mount(paymentElementRef.current);
        } else {
          console.warn("Payment element container not found.  Ensure the element with id 'payment-element' is rendered.");
          throw new Error("Payment element container not found.");
        }

        setIsStripeReady(true); // Stripe is ready after successful initialization
      } catch (error: any) {
        console.error("Error initializing Stripe:", error);
        const message = error.message || "Failed to initialize Stripe.";
        setErrorMessage(message);
        onSubscriptionError(message);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();

    return () => {
      paymentElement?.unmount();
    };
  }, [fetchClientSecret]); // Add fetchClientSecret as a dependency

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      const message = "Stripe.js has not loaded yet or client secret is missing. Please try again.";
      setErrorMessage(message);
      onSubscriptionError(message);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/subscription-success`,
        },
        redirect: "if_required" // Handle SCA redirects
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        let message = error.message || "Payment failed.";
        if (error.type === 'card_error' || error.type === 'validation_error') {
          message = error.message; // Use Stripe's specific error message
        }
        setErrorMessage(message);
        onSubscriptionError(message);
      } else {
        //  After handling the redirect, PaymentIntent.status is checked server-side.
        onSubscriptionSuccess();
      }
    } catch (error: any) {
      console.error("Error during payment confirmation:", error);
      const message = error.message || "An unexpected error occurred.";
      setErrorMessage(message);
      onSubscriptionError(message);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading ? 'Processing...' : 'Subscribe';
  const isButtonDisabled = loading || !stripe || !elements || !isStripeReady || !clientSecret;

  return (
    <form onSubmit={handleSubmit} aria-label="Subscription form">
      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
      <div id="payment-element" ref={paymentElementRef} aria-live="polite" aria-atomic="true" />
      <button
        type="submit"
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default StripeBilling;