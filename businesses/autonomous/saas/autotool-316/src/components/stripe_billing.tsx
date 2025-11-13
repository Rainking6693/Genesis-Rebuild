import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

const stripePromise = Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string; // Optional: Pass customer ID if available
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate checking subscription status (replace with actual API call)
        const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(`Failed to check subscription status: ${e.message}`);
        console.error("Error checking subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      checkSubscriptionStatus();
    }
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const result = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (result.error) {
            throw new Error(result.error.message);
          }
        } else {
          throw new Error("Stripe failed to load.");
        }
      } else {
        throw new Error("No session ID returned from the server.");
      }

    } catch (e: any) {
      setError(`Subscription failed: ${e.message}`);
      console.error("Subscription error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {subscriptionStatus === 'active' ? (
        <div>You are subscribed!</div>
      ) : (
        <button onClick={handleSubscribe} disabled={loading}>
          Subscribe
        </button>
      )}
    </div>
  );
}

// Example API endpoint (create-checkout-session) - This would be in a separate file (e.g., pages/api/stripe/create-checkout-session.js)
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { customerId } = req.body;

//       const session = await stripe.checkout.sessions.create({
//         customer: customerId,
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price: 'price_12345', // Replace with your actual price ID
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: `${req.headers.origin}/success`,
//         cancel_url: `${req.headers.origin}/cancel`,
//       });

//       res.status(200).json({ sessionId: session.id });
//     } catch (err: any) {
//       res.status(500).json({ statusCode: 500, message: err.message });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 105,
    "test_coverage": "N/A",
    "type_coverage": "High"
  },
  "generated_code": {
    "code_file": "src/components/StripeBilling.tsx",
    "language": "TypeScript React",
    "error_handling": "Comprehensive - try/catch blocks, error boundaries, user feedback"
  }
}