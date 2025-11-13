import React, { useEffect, useState } from 'react';
import { useUsageAnalytics } from '../../hooks/usage_analytics';

interface Props {
  message: string;
  isDisabled?: boolean;
  isTracking?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isDisabled = false, isTracking = false }) => {
  const { trackUsage } = useUsageAnalytics();
  const [localIsTracking, setLocalIsTracking] = useState(isTracking);

  useEffect(() => {
    if (!isDisabled && !localIsTracking) {
      setLocalIsTracking(true);
      trackUsage(message);
    }
  }, [message, isDisabled, trackUsage]);

  useEffect(() => {
    if (isTracking !== localIsTracking) {
      setLocalIsTracking(isTracking);
    }
  }, [isTracking]);

  return <div>{message}</div>;
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useUsageAnalytics } from '../../hooks/usage_analytics';

interface Props {
  message: string;
  isDisabled?: boolean;
  isTracking?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isDisabled = false, isTracking = false }) => {
  const { trackUsage } = useUsageAnalytics();
  const [localIsTracking, setLocalIsTracking] = useState(isTracking);

  useEffect(() => {
    if (!isDisabled && !localIsTracking) {
      setLocalIsTracking(true);
      trackUsage(message);
    }
  }, [message, isDisabled, trackUsage]);

  useEffect(() => {
    if (isTracking !== localIsTracking) {
      setLocalIsTracking(isTracking);
    }
  }, [isTracking]);

  return <div>{message}</div>;
};

export default MyComponent;