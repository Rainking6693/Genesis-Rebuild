import React, { FC, ReactNode, useMemo } from 'react';

interface Props {
  message?: string;
  isVisible?: boolean;
}

const defaultMessage = 'No message provided';

const MyComponent: FC<Props> = ({ message = defaultMessage, isVisible = true }) => {
  const visibleMessage = useMemo(() => {
    if (!message || message.trim() === '') return null;
    return message;
  }, [message]);

  if (!isVisible) return null;

  return (
    <div role="alert" aria-label="Alert message" data-testid="alert-message">
      {visibleMessage}
    </div>
  );
};

export { memo(MyComponent) as MyComponent };

import React, { FC, ReactNode, useMemo } from 'react';

interface Props {
  message?: string;
  isVisible?: boolean;
}

const defaultMessage = 'No message provided';

const MyComponent: FC<Props> = ({ message = defaultMessage, isVisible = true }) => {
  const visibleMessage = useMemo(() => {
    if (!message || message.trim() === '') return null;
    return message;
  }, [message]);

  if (!isVisible) return null;

  return (
    <div role="alert" aria-label="Alert message" data-testid="alert-message">
      {visibleMessage}
    </div>
  );
};

export { memo(MyComponent) as MyComponent };