import React, { FunctionComponent, ReactNode, ReactErrorProps } from 'react';
import { PropsWithChildren } from 'react';

type UsageAnalyticsProps = PropsWithChildren<{
  message?: string;
}>;

const UsageAnalytics: FunctionComponent<UsageAnalyticsProps> = ({ children, message }) => {
  const formattedMessage = message || children;

  // Add ARIA attributes for accessibility
  const ariaLabel = 'Usage Analytics Message';
  const ariaDescription = 'Displays the usage analytics message';

  // Check if the analytics service is available before rendering
  const [analyticsAvailable, setAnalyticsAvailable] = React.useState(false);

  React.useEffect(() => {
    // Simulate a check for the analytics service availability
    const checkAnalyticsService = async () => {
      try {
        // Replace this with your actual analytics service check
        const response = await fetch('https://your-analytics-service.com/api/check');
        setAnalyticsAvailable(response.ok);
      } catch (error) {
        console.error('Error checking analytics service:', error);
        setAnalyticsAvailable(false);
      }
    };

    checkAnalyticsService();
  }, []);

  if (!analyticsAvailable) {
    return (
      <div className="usage-analytics-message" aria-label={ariaLabel} aria-describedby={ariaDescription}>
        Analytics service unavailable. Please check your configuration.
      </div>
    );
  }

  return (
    <div className="usage-analytics-message" aria-label={ariaLabel} aria-describedby={ariaDescription}>
      {formattedMessage}
    </div>
  );
};

// Add error handling and logging for better security and maintainability
UsageAnalytics.defaultProps = {
  children: '',
};

UsageAnalytics.errorBoundary = ({ error }: ReactErrorProps) => {
  console.error('Error in UsageAnalytics component:', error);
  return (
    <div>
      An error occurred in UsageAnalytics: {error.message}
      <br />
      {/* Provide a fallback message for screen readers */}
      <span id="usage-analytics-error-description">An error occurred in the Usage Analytics component.</span>
    </div>
  );
};

export default UsageAnalytics;

This updated component checks the availability of the analytics service before rendering and provides a fallback message when the service is unavailable. It also includes an error boundary to handle any errors that might occur during the component's lifecycle.