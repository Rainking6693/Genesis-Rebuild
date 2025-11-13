import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FeatureFlags, FeatureFlagsResponse } from './FeatureFlags';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchFeatureFlags = useCallback(async () => {
    try {
      const featureFlags: FeatureFlagsResponse = await FeatureFlags.get();
      if (isMounted.current) {
        setIsFeatureEnabled(featureFlags.moodMailAIEnabled);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flags:', err);
        setIsFeatureEnabled(false);
        setError(err as Error);
      }
    }
  }, []);

  useEffect(() => {
    fetchFeatureFlags();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlags]);

  if (isFeatureEnabled === null) {
    return (
      <div role="status" aria-live="polite">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>An error occurred while fetching the feature flags: {error.message}</p>
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return null;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FeatureFlags, FeatureFlagsResponse } from './FeatureFlags';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchFeatureFlags = useCallback(async () => {
    try {
      const featureFlags: FeatureFlagsResponse = await FeatureFlags.get();
      if (isMounted.current) {
        setIsFeatureEnabled(featureFlags.moodMailAIEnabled);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flags:', err);
        setIsFeatureEnabled(false);
        setError(err as Error);
      }
    }
  }, []);

  useEffect(() => {
    fetchFeatureFlags();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlags]);

  if (isFeatureEnabled === null) {
    return (
      <div role="status" aria-live="polite">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>An error occurred while fetching the feature flags: {error.message}</p>
      </div>
    );
  }

  if (!isFeatureEnabled) {
    return null;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default MyComponent;