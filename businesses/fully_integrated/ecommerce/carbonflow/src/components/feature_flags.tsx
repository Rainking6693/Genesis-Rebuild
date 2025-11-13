import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isActive }) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('No auth token found');
        setIsEnabled(false);
        return;
      }

      const response = await fetch('/api/feature-flags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Error fetching feature flag: ${response.status} - ${response.statusText}`;
        setError(errorMessage);
        setIsEnabled(false);
        return;
      }

      const data = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (error) {
      const errorMessage = `Error fetching feature flag: ${(error as Error).message}`;
      setError(errorMessage);
      setIsEnabled(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return (
      <div className="feature-flag loading">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-flag error">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status" aria-live="polite">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`feature-flag ${isEnabled ? 'active' : 'inactive'}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status" aria-live="polite">
        {isEnabled ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({ title, description, isActive }) => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('No auth token found');
        setIsEnabled(false);
        return;
      }

      const response = await fetch('/api/feature-flags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Error fetching feature flag: ${response.status} - ${response.statusText}`;
        setError(errorMessage);
        setIsEnabled(false);
        return;
      }

      const data = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (error) {
      const errorMessage = `Error fetching feature flag: ${(error as Error).message}`;
      setError(errorMessage);
      setIsEnabled(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return (
      <div className="feature-flag loading">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-flag error">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="feature-flag-status" aria-live="polite">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`feature-flag ${isEnabled ? 'active' : 'inactive'}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status" aria-live="polite">
        {isEnabled ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};

export default FeatureFlag;