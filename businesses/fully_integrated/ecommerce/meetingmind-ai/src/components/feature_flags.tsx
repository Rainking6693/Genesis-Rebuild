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
      const response = await fetch(`/api/feature-flags/${encodeURIComponent(title)}`);
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
  }, [title, isEnabled]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isActive === null) {
    return (
      <div className="feature-flag">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-flag">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status error" aria-live="polite" aria-atomic="true">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feature-flag">
      <h3>{title}</h3>
      <p>{description}</p>
      <div
        className={`feature-flag-status ${isActive ? 'active' : 'inactive'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {isActive ? 'Enabled' : 'Disabled'}
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
      const response = await fetch(`/api/feature-flags/${encodeURIComponent(title)}`);
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
  }, [title, isEnabled]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isActive === null) {
    return (
      <div className="feature-flag">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-flag">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status error" aria-live="polite" aria-atomic="true">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feature-flag">
      <h3>{title}</h3>
      <p>{description}</p>
      <div
        className={`feature-flag-status ${isActive ? 'active' : 'inactive'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {isActive ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};

export default FeatureFlag;