import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  isFeatureEnabled: boolean | null;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, isFeatureEnabled }) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const isMountedRef = useRef(false);

  const handleFeatureEnabledChange = useCallback(() => {
    if (isFeatureEnabled !== null) {
      setIsVisible(isFeatureEnabled);
    }
  }, [isFeatureEnabled]);

  useEffect(() => {
    isMountedRef.current = true;

    // Check if the feature is enabled before making the component visible
    handleFeatureEnabledChange();

    return () => {
      isMountedRef.current = false;
    };
  }, [handleFeatureEnabledChange]);

  if (isVisible === null) {
    // Handle the case where isFeatureEnabled is not yet available
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-hidden={!isVisible}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  isFeatureEnabled: boolean | null;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, isFeatureEnabled }) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const isMountedRef = useRef(false);

  const handleFeatureEnabledChange = useCallback(() => {
    if (isFeatureEnabled !== null) {
      setIsVisible(isFeatureEnabled);
    }
  }, [isFeatureEnabled]);

  useEffect(() => {
    isMountedRef.current = true;

    // Check if the feature is enabled before making the component visible
    handleFeatureEnabledChange();

    return () => {
      isMountedRef.current = false;
    };
  }, [handleFeatureEnabledChange]);

  if (isVisible === null) {
    // Handle the case where isFeatureEnabled is not yet available
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-hidden={!isVisible}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default MyComponent;