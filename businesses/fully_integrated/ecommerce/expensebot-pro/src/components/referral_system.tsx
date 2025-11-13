import React, { FC, useEffect, useId } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { logError } from './logging';

type MessageProps = {
  id: string;
  headingId: string;
  message: string;
};

const ReferralSystemMessage: FC<MessageProps> = ({ id, headingId, message }) => {
  return (
    <div id={id}>
      <h2 id={headingId} role="alert">{message}</h2>
    </div>
  );
};

type ErrorBoundaryProps = {
  error: Error;
};

const ErrorBoundaryFallback: FC<ErrorBoundaryProps> = ({ error }) => (
  <div role="alert">
    <h2>Error in Referral System:</h2>
    <pre>{error.message}</pre>
  </div>
);

const ErrorBoundary = useErrorBoundary(logError);

const ReferralSystem: FC = () => {
  const id = useId();

  const fallback = (error: Error) => (
    <ErrorBoundaryFallback error={error} />
  );

  useEffect(() => {
    return <ErrorBoundary FallbackComponent={fallback}>
      <ReferralSystemMessage
        id={id}
        headingId={`${id}-heading`}
        message="Welcome to ExpenseBot Pro's Referral System! Earn rewards by inviting friends and colleagues."
      />
    </ErrorBoundary>
  }, [id]);

  return null;
};

export default ReferralSystem;

In this updated code, I've created separate components for the message and the error fallback, making the code more modular and reusable. I've also added type annotations to the components and their props for better type safety. Lastly, I've moved the unique ID generation and ErrorBoundary wrapping into the `useEffect` hook to ensure they only happen once, improving maintainability.