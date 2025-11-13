import React, { FunctionComponent, ReactNode, ReactErrorProps, useMemo } from 'react';

interface Props extends ReactErrorProps {
  message: string;
  testVariant?: string; // Add test variant prop for A/B testing
}

const MyComponent: FunctionComponent<Props> = ({ message, error, testVariant }) => {
  const memoizedMessage = useMemo(() => message, [message, testVariant]); // Include testVariant in useMemo dependency array

  const fallbackMessage = 'An error occurred';
  const ariaLabel = testVariant ? `${message} (${testVariant})` : message; // Set aria-label based on test variant

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: memoizedMessage }}
        aria-label={ariaLabel}
        aria-hidden={!testVariant} // Hide aria-label when not in A/B testing mode
      />
    </div>
  );
};

export default MyComponent;

import React, { FunctionComponent, ReactNode, ReactErrorProps, useMemo } from 'react';

interface Props extends ReactErrorProps {
  message: string;
  testVariant?: string; // Add test variant prop for A/B testing
}

const MyComponent: FunctionComponent<Props> = ({ message, error, testVariant }) => {
  const memoizedMessage = useMemo(() => message, [message, testVariant]); // Include testVariant in useMemo dependency array

  const fallbackMessage = 'An error occurred';
  const ariaLabel = testVariant ? `${message} (${testVariant})` : message; // Set aria-label based on test variant

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: memoizedMessage }}
        aria-label={ariaLabel}
        aria-hidden={!testVariant} // Hide aria-label when not in A/B testing mode
      />
    </div>
  );
};

export default MyComponent;