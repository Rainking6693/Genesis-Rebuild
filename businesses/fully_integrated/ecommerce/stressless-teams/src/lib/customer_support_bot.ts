import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const CustomerSupportBot: FC<Props> = ({ className, message, ...rest }) => {
  const finalMessage = message || 'Welcome to StressLess Teams customer support! How can I assist you today?';

  return (
    <div className={`customer-support-bot ${className}`} {...rest}>
      {finalMessage}
      <span className="sr-only">{finalMessage || 'No message provided'}</span>
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  className: '',
  role: 'alert',
  ariaLive: 'polite',
};

CustomerSupportBot.displayName = 'CustomerSupportBot';

// Use named export for better modularity and easier testing
export { CustomerSupportBot };

In this updated code, I've made the following changes:

1. Added a default value for the `message` prop to provide a fallback message when the prop is not provided.
2. Extracted the fallback message for screen readers into a separate span element.
3. Added a ternary operator to display the fallback message when the `message` prop is empty or undefined.
4. Moved the `role` and `ariaLive` props to the defaultProps for better organization and consistency.

These changes should make the component more resilient, accessible, and maintainable by handling edge cases and providing clear default values for the props.