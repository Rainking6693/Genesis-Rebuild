import React, { FunctionComponent, PropsWithChildren, ReactNode, ErrorInfo } from 'react';

interface UsageAnalyticsProps extends PropsWithChildren {
  message?: string;
  className?: string; // Added for custom class names
  ariaLabel?: string; // Added for accessibility
}

const UsageAnalytics: FunctionComponent<UsageAnalyticsProps> = ({ children, message, className, ariaLabel }) => {
  const fallbackMessage = message || 'No message provided';
  const fallback = (
    <div className={`usage-analytics ${className || ''}`} aria-label={ariaLabel}>
      {fallbackMessage}
    </div>
  );

  return (
    <div className={`usage-analytics ${className || ''}`} aria-label={ariaLabel}>
      {children || fallback}
    </div>
  );
};

UsageAnalytics.defaultProps = {
  message: 'No message provided',
  className: '',
  ariaLabel: 'Usage Analytics',
};

UsageAnalytics.errorBoundary = ({ error, componentStack }: ErrorInfo) => {
  console.error('Error in UsageAnalytics component:', error);
  return (
    <div className="error-container">
      <div>An error occurred in UsageAnalytics:</div>
      <pre>{error.message}</pre>
      <pre>{componentStack}</pre>
    </div>
  );
};

export default UsageAnalytics;

1. Added `className` and `ariaLabel` props for custom class names and accessibility.
2. Moved the default values for `className` and `ariaLabel` to `defaultProps`.
3. Added a default value for `className` to avoid potential errors when the prop is not provided.
4. Added the `usage-analytics` class to both the children and the fallback content for consistency.
5. Added the `aria-label` attribute to the container for accessibility.
6. Moved the import statement to the top of the file for better organization.