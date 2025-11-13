import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isActive }) => {
  const [isEnabled, setIsEnabled] = useState(isActive);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch(`/api/feature-flags/${encodeURIComponent(title)}`);
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
        setError(err as Error);
        console.error('Error fetching feature flag:', err);
      }
    }
  }, [title]);

  useEffect(() => {
    isMounted.current = true;
    fetchFeatureFlag();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlag]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error ? (
        <p aria-live="polite" role="alert" style={{ color: 'red' }}>
          Error fetching feature flag: {error.message}
        </p>
      ) : (
        <p>Feature Flag is {isEnabled ? 'Enabled' : 'Disabled'}</p>
      )}
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
  const [isEnabled, setIsEnabled] = useState(isActive);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch(`/api/feature-flags/${encodeURIComponent(title)}`);
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
        setError(err as Error);
        console.error('Error fetching feature flag:', err);
      }
    }
  }, [title]);

  useEffect(() => {
    isMounted.current = true;
    fetchFeatureFlag();

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeatureFlag]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error ? (
        <p aria-live="polite" role="alert" style={{ color: 'red' }}>
          Error fetching feature flag: {error.message}
        </p>
      ) : (
        <p>Feature Flag is {isEnabled ? 'Enabled' : 'Disabled'}</p>
      )}
    </div>
  );
};

export default FeatureFlag;