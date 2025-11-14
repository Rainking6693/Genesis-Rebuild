import React, { PropsWithChildren } from 'react';

interface Props {
  message?: string;
  className?: string;
  maxWidth?: string;
  minHeight?: string;
}

// Add a unique component name for better identification and accessibility
const CustomerSupportBot: React.FC<Props> = ({
  message = 'Welcome to Test E-Commerce Store!',
  className,
  maxWidth,
  minHeight,
  children,
}) => {
  // Use a constant for the component name to improve readability and maintainability
  const componentName = 'CustomerSupportBot';

  // Add a role attribute for accessibility
  const role = 'alert';

  // Add ARIA properties for accessibility
  const ariaLive = 'polite';
  const ariaDescribedby = `${componentName}-message`;

  // Add a data-testid for testing
  const dataTestId = componentName;

  // Add a wrapper for the message to support multiple children
  const wrapper = (
    <div
      role={role}
      aria-live={ariaLive}
      aria-describedby={ariaDescribedby}
      data-testid={dataTestId}
      className={className}
      style={{ maxWidth, minHeight }}
    >
      {children}
    </div>
  );

  // If the message prop is provided, use it as the child of the wrapper
  if (message) {
    return wrapper;
  }

  // If the message prop is not provided, use a fallback message
  return (
    <>
      {wrapper}
      <div id={`${componentName}-message`}>{message}</div>
    </>
  );
};

// Add a default export for better interoperability
export default CustomerSupportBot;

// Import the component with a descriptive alias
import { CustomerSupportBot as TestECommerceStoreCustomerSupportBot } from './CustomerSupportBot';

// Use the descriptive alias when using the component
<TestECommerceStoreCustomerSupportBot message="Welcome to Test E-Commerce Store!" />

This updated component now supports multiple children, has a fallback message, and includes ARIA properties for better accessibility. Additionally, it provides a `className`, `maxWidth`, and `minHeight` props for styling and maintainability.