import React, { FC, PropsWithChildren, ErrorBoundary, useEffect } from 'react';

interface Props extends PropsWithChildren {
  message?: string;
}

const UsageAnalytics: FC<Props> = ({ children, message }) => {
  const [localMessage, setLocalMessage] = React.useState(message || 'No usage analytics message provided.');

  useEffect(() => {
    // Log the message to your analytics service
    try {
      // Add try-catch block to handle potential errors when logging to analytics service
      logUsageAnalytics(localMessage);
    } catch (error) {
      console.error('Error logging usage analytics:', error);
    }
  }, [localMessage]);

  return (
    <div className="usage-analytics-message" role="alert">
      {children || localMessage}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add error handling and logging for better reliability and maintainability
UsageAnalytics.defaultProps = {};

// Define a custom error boundary for the UsageAnalytics component
UsageAnalytics.errorBoundary: React.FC<{ error: Error }> = ({ error }) => {
  console.error('Error in UsageAnalytics component:', error);

  // Log the error to your error reporting service
  // ...

  return (
    <ErrorBoundaryFallback error={error}>
      <div className="usage-analytics-error" role="alert">
        An error occurred in the UsageAnalytics component. Please check the console for more details.
      </div>
    </ErrorBoundaryFallback>
  );
};

// Define a custom error boundary fallback component
const ErrorBoundaryFallback: FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="usage-analytics-error" role="alert">
      <h2>An error occurred:</h2>
      <pre>{error.stack}</pre>
    </div>
  );
};

// Export the logUsageAnalytics function separately for easier testing and maintenance
export { logUsageAnalytics };

// Example usage of logUsageAnalytics function
function logUsageAnalytics(message: string) {
  // Implement your analytics service here
  console.log('Usage analytics message:', message);
}

export default UsageAnalytics;

In this updated code, I've added a try-catch block to handle potential errors when logging to the analytics service. I've also defined a custom error boundary for the `UsageAnalytics` component and a fallback component for displaying error details. Additionally, I've separated the `logUsageAnalytics` function for easier testing and maintenance.