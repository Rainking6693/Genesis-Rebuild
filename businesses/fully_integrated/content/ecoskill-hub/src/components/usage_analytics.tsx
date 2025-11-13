import React, { ReactNode, useEffect } from 'react';

interface Props {
  message: string;
  isAnalyticsEnabled?: boolean;
}

// Add a unique component name for better identification and debugging
const UsageAnalyticsComponent: React.FC<Props> = ({ message, isAnalyticsEnabled = true }) => {
  // Check if analytics is enabled before rendering the message
  const sendAnalyticsEvent = (message: string) => {
    // Add error handling for analytics library
    try {
      // Send analytics event
      // You should replace this with your actual analytics library and event sending function
      if (typeof window.analyticsSendEvent === 'function') {
        window.analyticsSendEvent({ message });
      }
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  };

  useEffect(() => {
    // Send analytics event on mount if analytics is enabled
    if (isAnalyticsEnabled) {
      sendAnalyticsEvent(message);
    }
  }, [message, isAnalyticsEnabled]);

  return (
    <div role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

// Add a defaultProps for isAnalyticsEnabled to avoid potential issues when the prop is missing
UsageAnalyticsComponent.defaultProps = {
  isAnalyticsEnabled: true,
};

// Use React.memo to improve performance by preventing unnecessary re-renders
const MemoizedUsageAnalyticsComponent = React.memo(UsageAnalyticsComponent);

// Export default with a meaningful name
export default {
  name: 'UsageAnalyticsComponent',
  component: MemoizedUsageAnalyticsComponent,
};

// Import the component with the meaningful name
import { UsageAnalyticsComponent } from './UsageAnalyticsComponent';

import React, { ReactNode, useEffect } from 'react';

interface Props {
  message: string;
  isAnalyticsEnabled?: boolean;
}

// Add a unique component name for better identification and debugging
const UsageAnalyticsComponent: React.FC<Props> = ({ message, isAnalyticsEnabled = true }) => {
  // Check if analytics is enabled before rendering the message
  const sendAnalyticsEvent = (message: string) => {
    // Add error handling for analytics library
    try {
      // Send analytics event
      // You should replace this with your actual analytics library and event sending function
      if (typeof window.analyticsSendEvent === 'function') {
        window.analyticsSendEvent({ message });
      }
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  };

  useEffect(() => {
    // Send analytics event on mount if analytics is enabled
    if (isAnalyticsEnabled) {
      sendAnalyticsEvent(message);
    }
  }, [message, isAnalyticsEnabled]);

  return (
    <div role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

// Add a defaultProps for isAnalyticsEnabled to avoid potential issues when the prop is missing
UsageAnalyticsComponent.defaultProps = {
  isAnalyticsEnabled: true,
};

// Use React.memo to improve performance by preventing unnecessary re-renders
const MemoizedUsageAnalyticsComponent = React.memo(UsageAnalyticsComponent);

// Export default with a meaningful name
export default {
  name: 'UsageAnalyticsComponent',
  component: MemoizedUsageAnalyticsComponent,
};

// Import the component with the meaningful name
import { UsageAnalyticsComponent } from './UsageAnalyticsComponent';