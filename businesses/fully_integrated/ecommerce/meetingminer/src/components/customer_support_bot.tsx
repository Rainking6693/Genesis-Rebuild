import React, { FC, useMemo } from 'react';
import { sanitizeUserInput } from 'input-sanitizer';
import { useTranslation, WithTranslation } from 'react-i18next';

// Customer Support Bot interface
interface CustomerSupportBotProps {
  message: string;
  defaultMessage: string;
  ariaLabel: string;
}

// Component implementation
const CustomerSupportBot: FC<CustomerSupportBotProps> = ({
  message,
  defaultMessage,
  ariaLabel,
}) => {
  const { t }: WithTranslation<unknown> = useTranslation();
  const sanitizedMessage = sanitizeUserInput(message);

  // Memoize the sanitized message for performance optimization
  const memoizedMessage = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  // Check if the message is empty, null, or undefined, and return a default message
  const finalMessage = memoizedMessage || (defaultMessage || t('customer_support_bot.default_message'));

  return (
    <div className="customer-support-bot" aria-label={ariaLabel}>
      {finalMessage}
    </div>
  );
};

export default CustomerSupportBot;

import React, { FC, useMemo } from 'react';
import { sanitizeUserInput } from 'input-sanitizer';
import { useTranslation, WithTranslation } from 'react-i18next';

// Customer Support Bot interface
interface CustomerSupportBotProps {
  message: string;
  defaultMessage: string;
  ariaLabel: string;
}

// Component implementation
const CustomerSupportBot: FC<CustomerSupportBotProps> = ({
  message,
  defaultMessage,
  ariaLabel,
}) => {
  const { t }: WithTranslation<unknown> = useTranslation();
  const sanitizedMessage = sanitizeUserInput(message);

  // Memoize the sanitized message for performance optimization
  const memoizedMessage = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  // Check if the message is empty, null, or undefined, and return a default message
  const finalMessage = memoizedMessage || (defaultMessage || t('customer_support_bot.default_message'));

  return (
    <div className="customer-support-bot" aria-label={ariaLabel}>
      {finalMessage}
    </div>
  );
};

export default CustomerSupportBot;