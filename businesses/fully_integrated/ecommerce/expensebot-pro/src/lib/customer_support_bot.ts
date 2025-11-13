import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const SupportBotMessage: FC<Props> = ({ className, ...props }) => {
  // Use a more descriptive and consistent component name
  return (
    <div className={className} {...props} role="alert">
      {props.children}
    </div>
  );
};

const CustomerSupportBot: FC<Props> = ({ message, ...rest }) => {
  // Add error handling for empty or invalid messages
  if (!message) {
    return <div>No message provided.</div>;
  }

  return (
    <div {...rest}>
      {/* Use the SupportBotMessage component */}
      <SupportBotMessage>{message}</SupportBotMessage>
    </div>
  );
};

// Add a named export for the component's title
export { CustomerSupportBot as ExpenseBotProCustomerSupportBot };

// Import and use the named export
import { ExpenseBotProCustomerSupportBot } from './CustomerSupportBot';

// Use the component in your application
<ExpenseBotProCustomerSupportBot message={yourMessage} className="customer-support-bot" />

In this updated version, I've added the ability to pass additional attributes to the `CustomerSupportBot` component, used the `SupportBotMessage` component for better maintainability, and added a class name to the `CustomerSupportBot` component for better styling.