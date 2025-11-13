import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
};

const CustomerSupportBot: FC<Props> = ({ className, message, ...rest }) => {
  return (
    <div className={`customer-support-bot ${className}`} {...rest} role="alert">
      {message}
    </div>
  );
};

// Add error handling for potential missing or invalid props
CustomerSupportBot.defaultProps = {
  className: '',
  message: 'Welcome to Carbon Compass Customer Support! How can I assist you today?',
};

// Use named export for better modularity and easier testing
export { CustomerSupportBot };

// Add a utility function to capitalize the first letter of the message
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Modify the defaultProps message to use the capitalized first letter
CustomerSupportBot.defaultProps = {
  ...CustomerSupportBot.defaultProps,
  message: capitalizeFirstLetter(CustomerSupportBot.defaultProps.message),
};

In this updated code:

1. I've extended the `Props` interface with `HTMLAttributes<HTMLDivElement>` to allow for additional HTML attributes on the `div` element.
2. I've added a `className` prop to allow for custom CSS classes.
3. I've added ARIA attributes (`role="alert"`) for accessibility.
4. I've created a utility function `capitalizeFirstLetter` to capitalize the first letter of the message, and applied it to the defaultProps message.
5. I've used named exports for better modularity and easier testing.

This updated code provides a more flexible and accessible `CustomerSupportBot` component, making it easier to maintain and test.