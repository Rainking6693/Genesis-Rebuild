import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    stripePromise.then(stripe => {
      if (!stripe) {
        setError("Stripe failed to load.");
      }
    });
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load.");
        setLoading(false);
        return;
      }

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, successUrl, cancelUrl }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        setError(result.error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <button role="link" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout'}
    </button>
  );
};

export default StripeCheckout;

// Error Boundary Component (Wrap StripeCheckout with this)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
**Explanation:**

*   **Stripe Initialization:** The component initializes Stripe using `loadStripe` with your publishable key.  **Important:**  Replace `"YOUR_STRIPE_PUBLISHABLE_KEY"` with your actual Stripe publishable key.
*   **Checkout Session Creation:**  The `handleClick` function sends a request to your backend (`/api/create-checkout-session`) to create a Stripe Checkout Session.  This is crucial: **You need to implement the `/api/create-checkout-session` endpoint on your server.** This endpoint should use the Stripe secret key to create the session.  The `priceId`, `successUrl`, and `cancelUrl` are passed to this endpoint.
*   **Redirection to Stripe:**  After receiving the session ID from your backend, the component redirects the user to Stripe's Checkout page using `stripe.redirectToCheckout`.
*   **Error Handling:** The component includes error handling for Stripe loading, API calls, and redirection.  It also uses a `try...catch` block to handle any unexpected errors.
*   **Loading State:**  The `loading` state provides visual feedback to the user while the checkout process is in progress.
*   **Error Boundary:** The `ErrorBoundary` component is included to catch any errors that might occur within the `StripeCheckout` component and display a fallback UI.  **Important:** You need to wrap the `StripeCheckout` component with the `ErrorBoundary` in your application.
*   **Props:** The component accepts `priceId`, `successUrl`, and `cancelUrl` as props.  `priceId` is the ID of the Stripe Price object you want to charge the customer for. `successUrl` is the URL the customer will be redirected to after a successful payment. `cancelUrl` is the URL the customer will be redirected to if they cancel the payment.

**Next Steps:**

1.  **Replace Placeholder:**  Replace `"YOUR_STRIPE_PUBLISHABLE_KEY"` with your actual Stripe publishable key.
2.  **Implement Backend Endpoint:** Implement the `/api/create-checkout-session` endpoint on your server.  This endpoint should use your Stripe secret key to create a Checkout Session.  Refer to the Stripe documentation for details on creating Checkout Sessions.
3.  **Wrap with Error Boundary:**  Wrap the `StripeCheckout` component with the `ErrorBoundary` component in your application.
4.  **Test Thoroughly:**  Test the component thoroughly to ensure that it handles all possible scenarios, including successful payments, declined payments, and errors.

This provides a robust and well-structured Stripe Checkout component with comprehensive error handling and a detailed build report. Remember to adapt the code to your specific needs and follow the Stripe documentation for best practices.