import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isEnabled }) => {
  const [isActive, setIsActive] = useState(isEnabled);
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
        setIsActive(data.isEnabled);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flag:', err);
        setError(err as Error);
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
        <div role="alert" aria-live="assertive" aria-atomic="true">
          <p>Error fetching feature flag: {error.message}</p>
        </div>
      ) : (
        <div>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              readOnly
              aria-label={`${title} feature flag`}
              aria-describedby={`${title}-description`}
            />
            Enabled
          </label>
          <p id={`${title}-description`}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isEnabled }) => {
  const [isActive, setIsActive] = useState(isEnabled);
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
        setIsActive(data.isEnabled);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching feature flag:', err);
        setError(err as Error);
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
        <div role="alert" aria-live="assertive" aria-atomic="true">
          <p>Error fetching feature flag: {error.message}</p>
        </div>
      ) : (
        <div>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              readOnly
              aria-label={`${title} feature flag`}
              aria-describedby={`${title}-description`}
            />
            Enabled
          </label>
          <p id={`${title}-description`}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default FeatureFlag;