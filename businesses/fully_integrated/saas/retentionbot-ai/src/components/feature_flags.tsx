import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isEnabled }) => {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setIsActive(data.isEnabled);
      setError(null);
    } catch (err) {
      console.error('Error fetching feature flag:', err);
      setIsActive(isEnabled);
      setError('Failed to fetch feature flag. Using default value.');
    }
  }, [isEnabled]);

  useEffect(() => {
    const timer = setInterval(fetchFeatureFlag, 60000); // Refetch every minute
    return () => clearInterval(timer);
  }, [fetchFeatureFlag]);

  if (isActive === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="feature-flag-error">
          {error}
        </div>
      )}
      <div aria-live="polite">
        {isActive ? (
          <span className="feature-flag-active" aria-label="Feature flag is enabled">
            Enabled
          </span>
        ) : (
          <span className="feature-flag-inactive" aria-label="Feature flag is disabled">
            Disabled
          </span>
        )}
      </div>
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isEnabled }) => {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setIsActive(data.isEnabled);
      setError(null);
    } catch (err) {
      console.error('Error fetching feature flag:', err);
      setIsActive(isEnabled);
      setError('Failed to fetch feature flag. Using default value.');
    }
  }, [isEnabled]);

  useEffect(() => {
    const timer = setInterval(fetchFeatureFlag, 60000); // Refetch every minute
    return () => clearInterval(timer);
  }, [fetchFeatureFlag]);

  if (isActive === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="feature-flag-error">
          {error}
        </div>
      )}
      <div aria-live="polite">
        {isActive ? (
          <span className="feature-flag-active" aria-label="Feature flag is enabled">
            Enabled
          </span>
        ) : (
          <span className="feature-flag-inactive" aria-label="Feature flag is disabled">
            Disabled
          </span>
        )}
      </div>
    </div>
  );
};

export default FeatureFlag;