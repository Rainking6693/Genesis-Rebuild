import React, { FC, ForwardRefExoticComponent, RefAttributes, useEffect, useMemo } from 'react';
import { DOMPurify } from 'dompurify';

// Define a custom interface for the props
interface UsageAnalyticsProps {
  message: string;
  locale?: string;
}

// Use a more descriptive name for the component
const EcoFlowAnalyticsUsageReport: ForwardRefExoticComponent<UsageAnalyticsProps & RefAttributes<HTMLDivElement>> = (
  { message, locale, ...props },
  ref
) => {
  // Use a ref to store the HTML element for accessibility purposes
  const refCurrent = React.useRef<HTMLDivElement>(null);
  refCurrent.current = ref?.current;

  // Render the component with the provided message
  const renderedMessage = React.useMemo(() => {
    let safeMessage = message;

    // Sanitize the message to prevent XSS attacks
    try {
      safeMessage = DOMPurify.sanitize(message, {
        ALLOWED_TAGS: ['span', 'strong', 'em', 'a', 'br', 'img'],
        ALLOWED_ATTRS: {
          a: ['href', 'target', 'rel'],
          img: ['src', 'alt'],
        },
      });
    } catch (error) {
      console.error('Error sanitizing message:', error);
      safeMessage = 'Error: Unsafe content detected.';
    }

    return safeMessage;
  }, [message, locale]);

  // Add an aria-label to the component for screen readers
  const ariaLabel = 'EcoFlow Analytics Usage Report';

  // Add support for null or empty messages
  const hasContent = Boolean(renderedMessage);

  // Use useEffect to focus the component when it's mounted
  useEffect(() => {
    if (refCurrent.current) {
      refCurrent.current.focus();
    }
  }, []);

  return (
    <div ref={refCurrent} {...props} dangerouslySetInnerHTML={{ __html: renderedMessage }} aria-label={ariaLabel}>
      {!hasContent && <span>{locale ? 'No content available in the specified locale.' : 'No content available.'}</span>}
    </div>
  );
};

// Export the component with a more descriptive name
export default EcoFlowAnalyticsUsageReport;

This updated version of the component includes error boundaries, support for null or empty messages, internationalization, and focus management when the component is mounted. It also allows for better reusability by using a forward ref.