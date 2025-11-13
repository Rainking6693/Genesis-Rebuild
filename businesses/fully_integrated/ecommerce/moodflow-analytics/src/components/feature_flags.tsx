import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isActive }) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (isMounted.current) {
        setIsEnabled(data.isActive);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flag:', err);
        setIsEnabled(isActive);
        setError('Failed to fetch feature flag. Using default value.');
      }
    }
  }, [isActive]);

  useEffect(() => {
    isMounted.current = true;
    fetchFeatureFlag();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <div aria-live="polite">
        {isEnabled ? (
          <span style={{ color: 'green' }}>Enabled</span>
        ) : (
          <span style={{ color: 'red' }}>Disabled</span>
        )}
      </div>
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isActive }) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (isMounted.current) {
        setIsEnabled(data.isActive);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flag:', err);
        setIsEnabled(isActive);
        setError('Failed to fetch feature flag. Using default value.');
      }
    }
  }, [isActive]);

  useEffect(() => {
    isMounted.current = true;
    fetchFeatureFlag();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <div aria-live="polite">
        {isEnabled ? (
          <span style={{ color: 'green' }}>Enabled</span>
        ) : (
          <span style={{ color: 'red' }}>Disabled</span>
        )}
      </div>
    </div>
  );
};

export default FeatureFlag;