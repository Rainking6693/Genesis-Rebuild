import React, { useDebugValue, useState } from 'react';

interface Props {
  message: string;
  isError?: boolean; // Add an optional 'isError' prop to handle error messages differently
}

// Add a unique component name for better identification and accessibility
const RetentionGeniusComponent: React.FC<Props> = ({ message, isError = false }) => {
  // Use a constant for the component name to improve readability and maintainability
  const componentName = 'RetentionGeniusComponent';

  // Use a React.useDebugValue hook to provide a clear name in React DevTools
  useDebugValue(`${componentName} - ${isError ? 'Error' : 'Message'}`);

  // Add a role and state to the div for better accessibility
  const [errorDescription, setErrorDescription] = useState('');
  const ariaRole = isError ? 'alert' : 'presentation';
  const ariaStatus = isError ? 'assertive' : 'none';
  const ariaDescribedBy = isError ? `error-description-${message}` : undefined;

  // Handle error cases and set error description
  React.useEffect(() => {
    if (isError) {
      setErrorDescription('An error occurred. Please contact support for assistance.');
    } else {
      setErrorDescription('');
    }
  }, [isError, message]);

  return (
    <div
      role={ariaRole}
      aria-label={componentName}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaStatus}
      aria-atomic={true} // Indicates that the content of the element changes in a single user action
      data-testid={`retention-genius-component-${isError ? 'error' : 'message'}`} // Add a data-testid for testing purposes
    >
      {message}
      {isError && (
        <div id={`error-description-${message}`} role="alert" aria-live="assertive">
          {errorDescription}
        </div>
      )}
    </div>
  );
};

// Add export comments for better understanding of the component
/**
 * RetentionGeniusComponent is a React functional component that displays a message.
 * It is used in the RetentionGenius application for various purposes such as displaying error messages or success messages.
 * The component now includes an optional 'isError' prop to handle error messages differently,
 * and it has been made more accessible by adding roles, states, and a data-testid.
 * Additionally, it handles error cases and sets error description for better resiliency.
 */
export { RetentionGeniusComponent };

In this updated code, I've added an optional `isError` prop to handle error messages differently. I've also made the component more accessible by adding roles, states, and a data-testid. Additionally, I've improved the resiliency by handling error cases and setting error description. Furthermore, I've used `useEffect` to update the error description when the `isError` or `message` props change.