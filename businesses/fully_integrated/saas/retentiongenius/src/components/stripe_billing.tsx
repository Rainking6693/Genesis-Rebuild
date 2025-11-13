import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Sanitize user-provided message to prevent XSS attacks
  const sanitizedMessage = useSanitizedMessage(message);

  // Use Stripe's API for billing-related operations
  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.REACT_APP_STRIPE_SECRET_KEY && customerId) {
      const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27', // Use the latest API version
      });

      stripe.billingPortal.sessions.create({ customer: customerId })
        .then((session) => {
          setBillingPortalUrl(session.url);
        })
        .catch((error) => {
          console.error('Error creating billing portal session:', error);
        });
    }
  }, [customerId]);

  const customerId = localStorage.getItem('customerId');

  // Check if customerId is present before redirecting to the billing portal
  if (customerId && billingPortalUrl) {
    return (
      <div role="presentation">
        {/* Display the sanitized message */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />

        {/* Redirect user to the billing portal session URL if available */}
        <a href={billingPortalUrl} target="_blank" rel="noopener noreferrer">Go to Billing Portal</a>
      </div>
    );
  }

  return null;
};

// Import sanitize function from a third-party library or create your own sanitization function
import sanitize from 'sanitize-html';

// Custom hook for sanitizing messages
function useSanitizedMessage(message: string): string {
  const sanitizedMessage = sanitize(message);
  return sanitizedMessage;
}

export default MyComponent;

In this updated code:

1. I've added the `Stripe` constructor options to use the latest API version.
2. I've added a check for the `customerId` and `billingPortalUrl` presence before rendering the component.
3. I've added `target="_blank" rel="noopener noreferrer"` attributes to the billing portal link for better accessibility and security.
4. I've added a `role="presentation"` attribute to the top-level `div` to improve accessibility.