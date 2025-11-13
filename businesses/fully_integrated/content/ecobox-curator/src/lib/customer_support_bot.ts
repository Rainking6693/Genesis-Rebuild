import React, { FC, Key } from 'react';
import { sanitize } from './sanitize';

interface Props {
  message?: string;
}

const sanitizeMessageIfNeeded = (message: string | undefined): string =>
  message ? sanitize(message) : '';

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeMessageIfNeeded(message);

  return (
    <div className="customer-support-bot" role="alert" tabIndex={0}>
      <div role="presentation">{sanitizedMessage || 'No message provided'}</div>
      <div role="presentation" key={sanitizedMessage}>
        {/* Add a unique key for the rendered children to ensure proper re-rendering */}
      </div>
    </div>
  );
};

// Add a unique name for the component for better identification and avoid naming conflicts
const EcoBoxCuratorCustomerSupportBot: FC<Props> = CustomerSupportBot;

// Export the updated component and the sanitized version for better maintainability
export { CustomerSupportBot, EcoBoxCuratorCustomerSupportBot };

import React, { FC, Key } from 'react';
import { sanitize } from './sanitize';

interface Props {
  message?: string;
}

const sanitizeMessageIfNeeded = (message: string | undefined): string =>
  message ? sanitize(message) : '';

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeMessageIfNeeded(message);

  return (
    <div className="customer-support-bot" role="alert" tabIndex={0}>
      <div role="presentation">{sanitizedMessage || 'No message provided'}</div>
      <div role="presentation" key={sanitizedMessage}>
        {/* Add a unique key for the rendered children to ensure proper re-rendering */}
      </div>
    </div>
  );
};

// Add a unique name for the component for better identification and avoid naming conflicts
const EcoBoxCuratorCustomerSupportBot: FC<Props> = CustomerSupportBot;

// Export the updated component and the sanitized version for better maintainability
export { CustomerSupportBot, EcoBoxCuratorCustomerSupportBot };