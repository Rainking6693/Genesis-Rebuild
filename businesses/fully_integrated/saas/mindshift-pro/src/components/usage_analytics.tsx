import React, { useEffect, useState } from 'react';
import { Analytics } from 'mindshift-pro-sdk';

interface Props {
  // Add eventName property to track specific user actions
  eventName: string;
  // Add optional isEnabled prop to control component behavior
  isEnabled?: boolean;
  // Add optional onError prop to handle errors
  onError?: (error: Error) => void;
}

const UsageAnalytics: React.FC<Props> = ({ eventName, isEnabled = true, onError }) => {
  const [analyticsAgent, setAnalyticsAgent] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const initializeAnalytics = async () => {
      try {
        const analytics = new Analytics();
        setAnalyticsAgent(analytics);
        if (analytics.isReady) {
          analytics.trackEvent(eventName);
        } else {
          await analytics.ready;
          analytics.trackEvent(eventName);
        }
      } catch (error) {
        if (onError) onError(error);
        console.error('Error initializing analytics agent:', error);
      }
    };

    initializeAnalytics();

    // Clean up on component unmount
    return () => {
      if (analyticsAgent) analyticsAgent.destroy();
    };
  }, [eventName, isEnabled, onError]);

  return <div></div>;
};

export default UsageAnalytics;

import React, { useEffect, useState } from 'react';
import { Analytics } from 'mindshift-pro-sdk';

interface Props {
  // Add eventName property to track specific user actions
  eventName: string;
  // Add optional isEnabled prop to control component behavior
  isEnabled?: boolean;
  // Add optional onError prop to handle errors
  onError?: (error: Error) => void;
}

const UsageAnalytics: React.FC<Props> = ({ eventName, isEnabled = true, onError }) => {
  const [analyticsAgent, setAnalyticsAgent] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const initializeAnalytics = async () => {
      try {
        const analytics = new Analytics();
        setAnalyticsAgent(analytics);
        if (analytics.isReady) {
          analytics.trackEvent(eventName);
        } else {
          await analytics.ready;
          analytics.trackEvent(eventName);
        }
      } catch (error) {
        if (onError) onError(error);
        console.error('Error initializing analytics agent:', error);
      }
    };

    initializeAnalytics();

    // Clean up on component unmount
    return () => {
      if (analyticsAgent) analyticsAgent.destroy();
    };
  }, [eventName, isEnabled, onError]);

  return <div></div>;
};

export default UsageAnalytics;