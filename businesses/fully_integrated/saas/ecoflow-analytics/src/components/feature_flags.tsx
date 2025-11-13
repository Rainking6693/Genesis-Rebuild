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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }

      const response = await fetch('/api/feature-flags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (error) {
      console.error('Error fetching feature flag:', error);
      setIsEnabled(isActive);
      setError((error as Error).message);
    }
  }, [isActive]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return error ? (
      <div className="feature-flag-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    ) : (
      <div className="feature-flag-loading">Loading...</div>
    );
  }

  return (
    <div className={`feature-flag ${isEnabled ? 'active' : 'inactive'}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status">
        <span
          className={`status-indicator ${isEnabled ? 'active' : 'inactive'}`}
          aria-label={isEnabled ? 'Enabled' : 'Disabled'}
        />
        <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in localStorage');
      }

      const response = await fetch('/api/feature-flags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (error) {
      console.error('Error fetching feature flag:', error);
      setIsEnabled(isActive);
      setError((error as Error).message);
    }
  }, [isActive]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  if (isEnabled === null) {
    return error ? (
      <div className="feature-flag-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    ) : (
      <div className="feature-flag-loading">Loading...</div>
    );
  }

  return (
    <div className={`feature-flag ${isEnabled ? 'active' : 'inactive'}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status">
        <span
          className={`status-indicator ${isEnabled ? 'active' : 'inactive'}`}
          aria-label={isEnabled ? 'Enabled' : 'Disabled'}
        />
        <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    </div>
  );
};

export default FeatureFlag;