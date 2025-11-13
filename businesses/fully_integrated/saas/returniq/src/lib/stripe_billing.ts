import React, { useEffect, useState } from 'react';
import { sanitize } from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return (
    <div
      className="stripe-billing-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
};

// Sanitize user-generated messages to prevent XSS attacks
const sanitizeMessage = (message: string) => {
  return sanitize(message, {
    ALLOWED_TAGS: ['span', 'a', 'strong', 'em', 'i'],
    ALLOWED_ATTRS: {
      '*': ['class', 'href', 'rel', 'target'],
    },
    FILTER_CSS_FALSE: true,
  });
};

// Wrap the component with a higher-order component to sanitize messages
const SanitizedMyComponent = (WrappedComponent: React.FC<Props>) => {
  const SanitizedComponent: React.FC<Props> = (props) => {
    const { message } = props;
    const [sanitizedMessage, setSanitizedMessage] = useState(message);

    useEffect(() => {
      setSanitizedMessage(sanitizeMessage(message));
    }, [message]);

    // Use the sanitized message in the component
    return <WrappedComponent message={sanitizedMessage} />;
  };

  return SanitizedComponent;
};

// Apply the higher-order component to the MyComponent
export const StripeBillingMessage = SanitizedMyComponent(MyComponent);

// Add ARIA attributes for accessibility
MyComponent.defaultProps = {
  'aria-label': 'Stripe Billing Message',
};

// Add a fallback for when the sanitization fails or the message is empty
MyComponent.fallback = () => <div>Unable to display message</div>;

import React, { useEffect, useState } from 'react';
import { sanitize } from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return (
    <div
      className="stripe-billing-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
};

// Sanitize user-generated messages to prevent XSS attacks
const sanitizeMessage = (message: string) => {
  return sanitize(message, {
    ALLOWED_TAGS: ['span', 'a', 'strong', 'em', 'i'],
    ALLOWED_ATTRS: {
      '*': ['class', 'href', 'rel', 'target'],
    },
    FILTER_CSS_FALSE: true,
  });
};

// Wrap the component with a higher-order component to sanitize messages
const SanitizedMyComponent = (WrappedComponent: React.FC<Props>) => {
  const SanitizedComponent: React.FC<Props> = (props) => {
    const { message } = props;
    const [sanitizedMessage, setSanitizedMessage] = useState(message);

    useEffect(() => {
      setSanitizedMessage(sanitizeMessage(message));
    }, [message]);

    // Use the sanitized message in the component
    return <WrappedComponent message={sanitizedMessage} />;
  };

  return SanitizedComponent;
};

// Apply the higher-order component to the MyComponent
export const StripeBillingMessage = SanitizedMyComponent(MyComponent);

// Add ARIA attributes for accessibility
MyComponent.defaultProps = {
  'aria-label': 'Stripe Billing Message',
};

// Add a fallback for when the sanitization fails or the message is empty
MyComponent.fallback = () => <div>Unable to display message</div>;