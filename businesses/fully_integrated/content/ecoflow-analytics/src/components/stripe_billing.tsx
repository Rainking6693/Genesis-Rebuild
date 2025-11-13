import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the message div
  isError?: boolean; // Flag for error messages to apply appropriate styling
}

const StripeBillingMessage: FunctionComponent<Props> = ({ className, message, isError = false, ...rest }) => {
  const ecoflowAnalyticsStripeBillingMessageClassNames = 'ecoflow-analytics-stripe-billing-message';
  const messageClassNames = `${ecoflowAnalyticsStripeBillingMessageClassNames} ${className}`;

  // Add aria-live property for screen reader accessibility
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div className={messageClassNames} {...rest}>
      <div aria-live={ariaLive}>
        {message}
      </div>
      {/* Allow for additional content within the message div */}
      {rest.children}
    </div>
  );
};

export default StripeBillingMessage;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the message div
  isError?: boolean; // Flag for error messages to apply appropriate styling
}

const StripeBillingMessage: FunctionComponent<Props> = ({ className, message, isError = false, ...rest }) => {
  const ecoflowAnalyticsStripeBillingMessageClassNames = 'ecoflow-analytics-stripe-billing-message';
  const messageClassNames = `${ecoflowAnalyticsStripeBillingMessageClassNames} ${className}`;

  // Add aria-live property for screen reader accessibility
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div className={messageClassNames} {...rest}>
      <div aria-live={ariaLive}>
        {message}
      </div>
      {/* Allow for additional content within the message div */}
      {rest.children}
    </div>
  );
};

export default StripeBillingMessage;