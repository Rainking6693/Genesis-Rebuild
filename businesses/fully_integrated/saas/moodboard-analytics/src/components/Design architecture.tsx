// sanitize.ts
import { useXSS } from 'xss';

const sanitize = useXSS();

export default sanitize;

// MyComponent.tsx
import React, { FC, useMemo } from 'react';
import { sanitize } from './sanitize';

type Props = {
  message: string;
  fallbackMessage?: string;
};

const MyComponent: FC<Props> = ({ message, fallbackMessage }) => {
  const safeMessage = useMemo(() => {
    try {
      return sanitize(message);
    } catch (error) {
      return fallbackMessage || 'Error while sanitizing message';
    }
  }, [message, fallbackMessage]);

  // Adding accessibility by providing a more descriptive ARIA label for screen readers
  const ariaLabel = 'MoodBoard Analytics message';

  return (
    <div className="moodboard-analytics-component" aria-label={ariaLabel}>
      {safeMessage}
    </div>
  );
};

MyComponent.displayName = 'MoodBoardAnalyticsMyComponent';

// Export the component and its sanitization utility for reuse
export { MyComponent, sanitize };

// Edge cases handling
// If message is empty, don't render anything to avoid unnecessary DOM elements
const emptyMessageComponent: FC<Props> = ({ message, fallbackMessage }) => {
  if (!message.trim()) {
    return null;
  }

  return <MyComponent message={message} fallbackMessage={fallbackMessage} />;
};

export default emptyMessageComponent;

// sanitize.ts
import { useXSS } from 'xss';

const sanitize = useXSS();

export default sanitize;

// MyComponent.tsx
import React, { FC, useMemo } from 'react';
import { sanitize } from './sanitize';

type Props = {
  message: string;
  fallbackMessage?: string;
};

const MyComponent: FC<Props> = ({ message, fallbackMessage }) => {
  const safeMessage = useMemo(() => {
    try {
      return sanitize(message);
    } catch (error) {
      return fallbackMessage || 'Error while sanitizing message';
    }
  }, [message, fallbackMessage]);

  // Adding accessibility by providing a more descriptive ARIA label for screen readers
  const ariaLabel = 'MoodBoard Analytics message';

  return (
    <div className="moodboard-analytics-component" aria-label={ariaLabel}>
      {safeMessage}
    </div>
  );
};

MyComponent.displayName = 'MoodBoardAnalyticsMyComponent';

// Export the component and its sanitization utility for reuse
export { MyComponent, sanitize };

// Edge cases handling
// If message is empty, don't render anything to avoid unnecessary DOM elements
const emptyMessageComponent: FC<Props> = ({ message, fallbackMessage }) => {
  if (!message.trim()) {
    return null;
  }

  return <MyComponent message={message} fallbackMessage={fallbackMessage} />;
};

export default emptyMessageComponent;