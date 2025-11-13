import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
  isError?: boolean;
}

const CustomerSupportBot: FC<Props> = ({ className, message, isError = false, ...rest }) => {
  // Add a role attribute for screen readers
  const role = isError ? 'alert' : 'status';

  // Add an aria-live property for dynamic updates
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div className={`review-boost-ai-customer-support-bot ${className}`} role={role} aria-live={ariaLive} {...rest}>
      {message}
    </div>
  );
};

CustomerSupportBot.displayName = 'ReviewBoostAI_CustomerSupportBot';

export default CustomerSupportBot;

In this updated version, I've added an `isError` prop to indicate whether the message is an error or not. This allows for better customization of the component's behavior and appearance. I've also added an `aria-live` property to improve accessibility for screen reader users. The `aria-live` attribute is set to 'assertive' for error messages and 'polite' for other messages, which helps screen readers announce the message in a timely and appropriate manner.