import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

// Define a custom interface for the props
interface ReferralSystemMessageProps {
  message: string;
}

// Add a unique component name for better identification and debugging
const ReferralSystemMessage: FC<ReferralSystemMessageProps> = ({ message }) => {
  // Sanitize user-generated content before rendering to prevent XSS attacks
  const sanitizedMessage = useMemo(() => DOMPurify.sanitize(message), [message]);

  // Add ARIA attributes for screen readers
  const ariaLabel = 'Referral system message';

  return (
    <div
      // Use a unique key for each message instance to ensure proper rendering and updates
      key={message}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      // Add ARIA attributes for screen readers
      aria-label={ariaLabel}
    />
  );
};

// Export the component with a descriptive name that aligns with the business context
export default ReferralSystemMessage;

In this updated version, I've added a unique key to each message instance for proper rendering and updates, and I've added an `aria-label` attribute for better accessibility. I've also used the `useMemo` hook to memoize the sanitized message, improving performance. Lastly, I've defined a custom interface for the props to improve maintainability.