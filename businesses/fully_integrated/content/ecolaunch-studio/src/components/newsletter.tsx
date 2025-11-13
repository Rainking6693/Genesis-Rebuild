import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const fallbackMessage = 'An error occurred while rendering the message';
  const fallbackAriaLabel = ariaLabel || 'Error message';

  return (
    <div className={className}>
      {message || fallbackMessage}
      <div aria-hidden={message ? 'true' : 'false'} aria-label={fallbackAriaLabel}>
        {message ? null : fallbackMessage}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const fallbackMessage = 'An error occurred while rendering the message';
  const fallbackAriaLabel = ariaLabel || 'Error message';

  return (
    <div className={className}>
      {message || fallbackMessage}
      <div aria-hidden={message ? 'true' : 'false'} aria-label={fallbackAriaLabel}>
        {message ? null : fallbackMessage}
      </div>
    </div>
  );
};

export default MyComponent;