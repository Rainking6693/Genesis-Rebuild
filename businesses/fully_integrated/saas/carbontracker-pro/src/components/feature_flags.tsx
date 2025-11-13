import React, { useEffect, useState, useMemo } from 'react';

interface Props {
  message: string;
  isFeatureEnabled: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isFeatureEnabled }) => {
  const [title, setTitle] = useState<string>(document.title);

  const memoizedTitle = useMemo(() => title, [title]);

  useEffect(() => {
    if (isFeatureEnabled) {
      try {
        document.title = message; // Update the title for better SEO and user experience
        setTitle(message);
      } catch (error) {
        console.error('Error updating document title:', error);
      }
    } else {
      document.title = memoizedTitle; // Restore the original title in case the feature is disabled
    }
  }, [isFeatureEnabled, message]);

  return (
    <div>
      {isFeatureEnabled && <div>{message}</div>}
      {/* Add an aria-hidden attribute to the container to improve accessibility */}
      <div aria-hidden={!isFeatureEnabled}>
        {/* Provide a fallback content for screen readers and search engines */}
        <div>{message || 'Fallback content'}</div>
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState, useMemo } from 'react';

interface Props {
  message: string;
  isFeatureEnabled: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isFeatureEnabled }) => {
  const [title, setTitle] = useState<string>(document.title);

  const memoizedTitle = useMemo(() => title, [title]);

  useEffect(() => {
    if (isFeatureEnabled) {
      try {
        document.title = message; // Update the title for better SEO and user experience
        setTitle(message);
      } catch (error) {
        console.error('Error updating document title:', error);
      }
    } else {
      document.title = memoizedTitle; // Restore the original title in case the feature is disabled
    }
  }, [isFeatureEnabled, message]);

  return (
    <div>
      {isFeatureEnabled && <div>{message}</div>}
      {/* Add an aria-hidden attribute to the container to improve accessibility */}
      <div aria-hidden={!isFeatureEnabled}>
        {/* Provide a fallback content for screen readers and search engines */}
        <div>{message || 'Fallback content'}</div>
      </div>
    </div>
  );
};

export default MyComponent;