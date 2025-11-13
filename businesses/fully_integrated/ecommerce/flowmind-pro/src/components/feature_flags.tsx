import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setEnabled(isEnabled);
    } else {
      setEnabled(isEnabled);
    }
  }, [isEnabled]);

  const handleToggle = useCallback(() => {
    if (typeof enabled !== 'undefined') {
      const newEnabled = !enabled;
      setEnabled(newEnabled);
      onToggle(newEnabled);
    }
  }, [enabled, onToggle]);

  if (typeof enabled === 'undefined') {
    return null; // Render nothing until the initial state is set
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            aria-label={`Toggle ${title} feature`}
            aria-describedby={`${title}-description`}
          />
          Enabled
        </label>
        <p id={`${title}-description`}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setEnabled(isEnabled);
    } else {
      setEnabled(isEnabled);
    }
  }, [isEnabled]);

  const handleToggle = useCallback(() => {
    if (typeof enabled !== 'undefined') {
      const newEnabled = !enabled;
      setEnabled(newEnabled);
      onToggle(newEnabled);
    }
  }, [enabled, onToggle]);

  if (typeof enabled === 'undefined') {
    return null; // Render nothing until the initial state is set
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            aria-label={`Toggle ${title} feature`}
            aria-describedby={`${title}-description`}
          />
          Enabled
        </label>
        <p id={`${title}-description`}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureFlag;