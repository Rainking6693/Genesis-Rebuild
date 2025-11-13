import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Track component usage analytics
    trackUsageAnalytics();
  }, []);

  const trackUsageAnalytics = async () => {
    try {
      // Send usage data to the analytics agent
      const analyticsData = {
        componentName: 'MyComponent',
        title: title || 'Untitled',
        viewCount: viewCount + 1,
      };
      await sendToAnalyticsAgent(analyticsData);
      setViewCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error tracking usage analytics:', error);
    }
  };

  const sendToAnalyticsAgent = async (data: any) => {
    try {
      // Securely send data to the analytics agent
      const response = await fetch('/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await response.json();
    } catch (error) {
      console.error('Error sending analytics data:', error);
    }
  };

  return (
    <div>
      <h1>{title || 'Untitled'}</h1>
      <p>{content || 'No content available'}</p>
      <p aria-label={`View count: ${viewCount}`}>View count: {viewCount}</p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Track component usage analytics
    trackUsageAnalytics();
  }, []);

  const trackUsageAnalytics = async () => {
    try {
      // Send usage data to the analytics agent
      const analyticsData = {
        componentName: 'MyComponent',
        title: title || 'Untitled',
        viewCount: viewCount + 1,
      };
      await sendToAnalyticsAgent(analyticsData);
      setViewCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error tracking usage analytics:', error);
    }
  };

  const sendToAnalyticsAgent = async (data: any) => {
    try {
      // Securely send data to the analytics agent
      const response = await fetch('/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await response.json();
    } catch (error) {
      console.error('Error sending analytics data:', error);
    }
  };

  return (
    <div>
      <h1>{title || 'Untitled'}</h1>
      <p>{content || 'No content available'}</p>
      <p aria-label={`View count: ${viewCount}`}>View count: {viewCount}</p>
    </div>
  );
};

export default MyComponent;