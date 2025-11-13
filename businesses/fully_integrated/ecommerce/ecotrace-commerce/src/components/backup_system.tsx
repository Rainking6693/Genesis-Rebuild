import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  isError?: boolean;
  timeToLive?: number; // New property to control message visibility
}

const EcoTraceComponent: FC<Props> = ({ message, isError = false, timeToLive = 5000 }) => {
  const [visuallyHidden, setVisuallyHidden] = useState(false);

  useEffect(() => {
    if (isError) {
      setVisuallyHidden(true);
    } else {
      const timer = setTimeout(() => {
        setVisuallyHidden(true);
      }, timeToLive);

      return () => clearTimeout(timer);
    }
  }, [isError, timeToLive]);

  const ariaLabel = isError ? 'Error message' : 'Backup message';
  const className = `eco-trace-message-content ${visuallyHidden ? 'visually-hidden' : ''}`;

  return (
    <div className="eco-trace-message" role="alert">
      <div className={className}>
        {message}
      </div>
      <div className="eco-trace-message-aria-label">
        {ariaLabel}
      </div>
    </div>
  );
};

export default EcoTraceComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  isError?: boolean;
  timeToLive?: number; // New property to control message visibility
}

const EcoTraceComponent: FC<Props> = ({ message, isError = false, timeToLive = 5000 }) => {
  const [visuallyHidden, setVisuallyHidden] = useState(false);

  useEffect(() => {
    if (isError) {
      setVisuallyHidden(true);
    } else {
      const timer = setTimeout(() => {
        setVisuallyHidden(true);
      }, timeToLive);

      return () => clearTimeout(timer);
    }
  }, [isError, timeToLive]);

  const ariaLabel = isError ? 'Error message' : 'Backup message';
  const className = `eco-trace-message-content ${visuallyHidden ? 'visually-hidden' : ''}`;

  return (
    <div className="eco-trace-message" role="alert">
      <div className={className}>
        {message}
      </div>
      <div className="eco-trace-message-aria-label">
        {ariaLabel}
      </div>
    </div>
  );
};

export default EcoTraceComponent;