import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface Props {
  message: string;
}

interface ErrorContextData {
  addError: (error: Error) => void;
}

const ErrorContextDefaultValue: ErrorContextData = {
  addError: () => {},
};

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const { addError } = useContext(ErrorContext) || ErrorContextDefaultValue;
  const [fallbackMessage, setFallbackMessage] = useState<ReactNode | null>(null);

  useEffect(() => {
    let errorMessage: string | null = null;

    try {
      // Add your custom validation or sanitization logic here
      // If the message is invalid, set the errorMessage with an error message
      // For example:
      // if (message.includes('<script>')) {
      //   errorMessage = 'Invalid input. Please avoid using script tags.';
      // }

      if (errorMessage) {
        addError(new Error(errorMessage));
      }
    } catch (error) {
      addError(error);
    }

    setFallbackMessage(errorMessage || null);
  }, [message, addError]);

  return (
    <div className="customer-support-bot">
      {fallbackMessage || message}
    </div>
  );
};

CustomerSupportBot.error = (error: Error) => {
  console.error(error);
};

// Optimize performance by memoizing the component if props remain unchanged
const MemoizedCustomerSupportBot = React.memo(CustomerSupportBot);

// Add accessibility improvements by wrapping the component with a div and providing a role
const AccessibleCustomerSupportBot = (props: Props) => (
  <div role="alert">
    <MemoizedCustomerSupportBot {...props} />
  </div>
);

export default AccessibleCustomerSupportBot;

In this updated version, I've added the following improvements:

1. Stored the error message in a separate variable to avoid re-throwing the error multiple times if validation fails.
2. Checked if the error message is set before adding it to the error context.
3. Wrapped the component with a `div` and provided a `role="alert"` to improve accessibility.
4. Renamed the component to `AccessibleCustomerSupportBot` to reflect the accessibility improvements.