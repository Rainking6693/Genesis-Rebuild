import React, { FC, ReactNode, Key } from 'react';

interface Props {
  message: string;
  key?: Key; // Use Key instead of string for unique keys
  className?: string;
  dataTestId?: string;
}

// Add a default key for each instance of the component
const UsageAnalyticsComponent: FC<Props> = ({ message, key = `usage-analytics-${Math.random().toString(36).substr(2, 9)}`, className, dataTestId }) => {
  // Add a role="alert" for better accessibility
  // Add aria-label for non-visible alerts
  return (
    <div className={className} role="alert" aria-label="Usage Analytics Message">
      <div data-testid={dataTestId}>{message}</div>
    </div>
  );
};

// Export the component with a descriptive name that aligns with the business context
// Add a version number or timestamp for maintainability purposes
export default {
  name: 'FinFlowAcademy_UsageAnalytics_v1.0.0',
  component: UsageAnalyticsComponent,
};

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  message: string;
  key?: Key; // Use Key instead of string for unique keys
  className?: string;
  dataTestId?: string;
}

// Add a default key for each instance of the component
const UsageAnalyticsComponent: FC<Props> = ({ message, key = `usage-analytics-${Math.random().toString(36).substr(2, 9)}`, className, dataTestId }) => {
  // Add a role="alert" for better accessibility
  // Add aria-label for non-visible alerts
  return (
    <div className={className} role="alert" aria-label="Usage Analytics Message">
      <div data-testid={dataTestId}>{message}</div>
    </div>
  );
};

// Export the component with a descriptive name that aligns with the business context
// Add a version number or timestamp for maintainability purposes
export default {
  name: 'FinFlowAcademy_UsageAnalytics_v1.0.0',
  component: UsageAnalyticsComponent,
};