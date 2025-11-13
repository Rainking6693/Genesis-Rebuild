import React, { memo, useMemo } from 'react';

interface Props {
  message?: string;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<Props> = React.memo(({ message, className, 'aria-label': ariaLabel }) => {
  const renderedMessage = useMemo(() => {
    if (!message) {
      return 'No message provided';
    }

    return message;
  }, [message]);

  return (
    <div className={className} aria-label={ariaLabel}>
      {renderedMessage}
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface Props {
  message?: string;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<Props> = React.memo(({ message, className, 'aria-label': ariaLabel }) => {
  const renderedMessage = useMemo(() => {
    if (!message) {
      return 'No message provided';
    }

    return message;
  }, [message]);

  return (
    <div className={className} aria-label={ariaLabel}>
      {renderedMessage}
    </div>
  );
});

export default MyComponent;