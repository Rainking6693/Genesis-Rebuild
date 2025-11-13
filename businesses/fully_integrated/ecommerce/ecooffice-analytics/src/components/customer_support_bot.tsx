import React, { FC, useMemo, useRef } from 'react';
import { sanitizeUserInput } from 'security-library';
import { useTranslation } from 'react-i18next';

interface Props {
  message?: string;
}

type TFunction = (...args: any[]) => string;

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t }: { t: TFunction } = useTranslation();

  // Sanitize user input before rendering to protect against XSS attacks
  const sanitizedMessage = sanitizeUserInput(message || '');

  // Set the `aria-label` attribute for accessibility
  const ariaLabel = useMemo(() => t('customer_support_bot_message'), [t]);

  // Focus the component when it receives focus for better accessibility
  const handleFocus = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div
      className="customer-support-bot-message"
      ref={ref}
      aria-label={ariaLabel}
      role="presentation"
      tabIndex={0}
      data-testid="customer-support-bot"
      onFocus={handleFocus}
    >
      {sanitizedMessage}
    </div>
  );
};

// Add a unique name for the component for better identification and avoid naming conflicts
const EcoOfficeAnalyticsCustomerSupportBot: React.FC<Props> = CustomerSupportBot;

// Optimize performance by memoizing the component if props don't change
export default React.memo(EcoOfficeAnalyticsCustomerSupportBot);

This updated version of the component includes improvements for resiliency, edge cases, accessibility, and maintainability. It handles cases where the `message` prop might be undefined or null, ensures that the component can be focused with the keyboard, provides a more meaningful description of the component for screen readers, and includes a `data-testid` attribute for easier testing. Additionally, it uses type annotations to improve type safety.