import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/AnalyticsService';

interface Props {
  skillId: string;
}

const MyComponent: React.FC<Props> = ({ skillId }) => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAnalytics = async () => {
      try {
        const isEnabled = await AnalyticsService.isEnabled();
        setIsAnalyticsEnabled(isEnabled);
      } catch (error) {
        console.error('Error checking analytics:', error);
        setIsAnalyticsEnabled(false);
      }
    };

    checkAnalytics();
  }, []);

  useEffect(() => {
    if (isAnalyticsEnabled === true) {
      AnalyticsService.trackUsage(skillId);
    }
  }, [skillId, isAnalyticsEnabled]);

  return (
    <div>
      {/* Render personalized skill development path content */}
      {/* Add ARIA attributes for accessibility */}
      <div aria-label="Personalized skill development path content" role="region">
        {/* Replace with your actual content */}
        <h2>Your personalized skill development path:</h2>
        {/* ... */}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/AnalyticsService';

interface Props {
  skillId: string;
}

const MyComponent: React.FC<Props> = ({ skillId }) => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAnalytics = async () => {
      try {
        const isEnabled = await AnalyticsService.isEnabled();
        setIsAnalyticsEnabled(isEnabled);
      } catch (error) {
        console.error('Error checking analytics:', error);
        setIsAnalyticsEnabled(false);
      }
    };

    checkAnalytics();
  }, []);

  useEffect(() => {
    if (isAnalyticsEnabled === true) {
      AnalyticsService.trackUsage(skillId);
    }
  }, [skillId, isAnalyticsEnabled]);

  return (
    <div>
      {/* Render personalized skill development path content */}
      {/* Add ARIA attributes for accessibility */}
      <div aria-label="Personalized skill development path content" role="region">
        {/* Replace with your actual content */}
        <h2>Your personalized skill development path:</h2>
        {/* ... */}
      </div>
    </div>
  );
};

export default MyComponent;