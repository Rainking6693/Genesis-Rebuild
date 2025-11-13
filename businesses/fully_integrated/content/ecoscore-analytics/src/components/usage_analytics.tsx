import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
  isAnalyticsEnabled?: boolean;
}

// Add a unique component name for better identification and maintenance
const UsageAnalytics: React.FC<Props> = ({ message, isAnalyticsEnabled = true }) => {
  // Use a constant for the component name to improve readability and maintainability
  const componentName = 'UsageAnalytics';

  // Log the component name and message for debugging and monitoring purposes
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (isAnalyticsEnabled && !logged) {
      console.log(`${componentName}: ${message}`);
      setLogged(true);
    }
  }, [message, componentName, isAnalyticsEnabled]);

  // Add an aria-label for accessibility
  const ariaLabel = `Usage analytics: ${message}`;

  // Handle null or empty message to prevent errors and improve resiliency
  if (!message) {
    return <div aria-hidden="true"></div>;
  }

  return <div aria-label={ariaLabel}>{message}</div>;
};

// Add a default export for better interoperability
export default UsageAnalytics;

import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
  isAnalyticsEnabled?: boolean;
}

// Add a unique component name for better identification and maintenance
const UsageAnalytics: React.FC<Props> = ({ message, isAnalyticsEnabled = true }) => {
  // Use a constant for the component name to improve readability and maintainability
  const componentName = 'UsageAnalytics';

  // Log the component name and message for debugging and monitoring purposes
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (isAnalyticsEnabled && !logged) {
      console.log(`${componentName}: ${message}`);
      setLogged(true);
    }
  }, [message, componentName, isAnalyticsEnabled]);

  // Add an aria-label for accessibility
  const ariaLabel = `Usage analytics: ${message}`;

  // Handle null or empty message to prevent errors and improve resiliency
  if (!message) {
    return <div aria-hidden="true"></div>;
  }

  return <div aria-label={ariaLabel}>{message}</div>;
};

// Add a default export for better interoperability
export default UsageAnalytics;