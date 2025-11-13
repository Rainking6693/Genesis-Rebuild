import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const StripeBillingMessageComponent: FC<Props> = ({ message, children, ...rest }) => {
  // Add a default message for edge cases where no message is provided
  const sanitizedMessage = message || 'No message provided';

  // Use a safe method for setting inner HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(sanitizedMessage);

  // Wrap the message in a div with an aria-label for accessibility improvements
  return (
    <div {...rest} aria-label="Stripe Billing Message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      {children}
    </div>
  );
};

// Import a sanitization library to prevent XSS attacks
import DOMPurify from 'dompurify';
const sanitize = DOMPurify.sanitize;

// Use named export for better readability and maintainability
export { StripeBillingMessageComponent };

StripeBillingMessageComponent.defaultProps = {
  message: '',
};

StripeBillingMessageComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
};

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const StripeBillingMessageComponent: FC<Props> = ({ message, children, ...rest }) => {
  // Add a default message for edge cases where no message is provided
  const sanitizedMessage = message || 'No message provided';

  // Use a safe method for setting inner HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(sanitizedMessage);

  // Wrap the message in a div with an aria-label for accessibility improvements
  return (
    <div {...rest} aria-label="Stripe Billing Message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      {children}
    </div>
  );
};

// Import a sanitization library to prevent XSS attacks
import DOMPurify from 'dompurify';
const sanitize = DOMPurify.sanitize;

// Use named export for better readability and maintainability
export { StripeBillingMessageComponent };

StripeBillingMessageComponent.defaultProps = {
  message: '',
};

StripeBillingMessageComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
};