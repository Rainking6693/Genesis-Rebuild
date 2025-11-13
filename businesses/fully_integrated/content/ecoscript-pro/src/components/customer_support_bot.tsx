import React, { FC, useState, useCallback, useMemo } from 'react';
import { sanitize } from 'defensics';

interface Props {
  message?: string;
  defaultMessage?: string;
  className?: string;
  darkMode?: boolean;
  testId?: string;
}

const CustomerSupportBot: FC<Props> = ({
  message = '',
  defaultMessage = 'No message provided',
  className = 'customer-support-bot',
  darkMode = false,
  testId = 'customer-support-bot',
}) => {
  const [error, setError] = useState(false);

  const sanitizedMessage = useCallback(() => sanitize(message), [message]);

  const handleError = useCallback(() => {
    setError(true);
    console.error('Invalid props provided to CustomerSupportBot component.');
  }, []);

  React.useEffect(handleError, [message, className, darkMode]);

  const darkModeClass = darkMode ? 'dark-mode' : '';

  return (
    <div data-testid={testId} className={`${className} ${darkModeClass} ${error ? 'error' : ''}`} aria-label="Customer Support Bot">
      {sanitizedMessage()}
      {error && <span className="error-message">Invalid props provided to CustomerSupportBot component.</span>}
    </div>
  );
};

// Add a unique name for the component to improve maintainability
const EcoScriptProContent = CustomerSupportBot;

// Optimize performance by memoizing the component and its sanitizedMessage function
const CustomerSupportBotMemo = React.memo((props) => {
  const { message, ...rest } = props;
  const sanitizedMessage = useMemo(() => sanitize(message), [message]);
  return <CustomerSupportBot message={sanitizedMessage} {...rest} />;
}, []);

// Export the optimized component for better maintainability
export default CustomerSupportBotMemo;

In this updated code, I've added a `darkMode` prop to support dark mode, a `testId` prop for easier testing, and I've separated the sanitizedMessage function from the component to only re-compute it when the message prop changes. This helps improve performance by preventing unnecessary re-renders.